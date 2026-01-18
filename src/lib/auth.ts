import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from 'resend';
import { getHtmlTemplate } from "@/lib/email";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
    providers: [
        EmailProvider({
            server: "",
            from: "no-reply@visionboard.ro",
            async sendVerificationRequest({ identifier: email, url }) {
                if (!resend) {
                    console.error("RESEND_API_KEY lipsă.");
                    if (process.env.NODE_ENV === 'development') {
                        console.log("Link autentificare (DEV):", url);
                        return;
                    }
                    throw new Error("Serviciul de email indisponibil.");
                }

                const html = getHtmlTemplate({
                    title: "Autentificare Visionboard",
                    message: "Apasă pe butonul de mai jos pentru a te autentifica în contul tău Visionboard. Acest link este valabil 24 de ore.",
                    buttonText: "Autentificare",
                    buttonUrl: url,
                    footerText: "Dacă nu ai încercat să te autentifici, ignoră acest email."
                });

                try {
                    await resend.emails.send({
                        from: 'Visionboard <no-reply@visionboard.ro>',
                        to: email,
                        subject: 'Link de autentificare Visionboard',
                        html: html,
                    });
                } catch (error) {
                    console.error("Eroare la trimiterea email-ului de login:", error);
                    throw new Error("Nu s-a putut trimite email-ul.");
                }
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: {
                        email_source: {
                            email: credentials.email,
                            source: "Visionboard"
                        }
                    }
                });

                if (!user || !user.passwordHash) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;

                return user;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.sub = user.id;
            }

            if (trigger === "update" && session?.user) {
                token.name = session.user.name;
                token.email = session.user.email;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                (session.user as any).id = token.sub;

                try {
                    const freshUser = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: { name: true, email: true, role: true }
                    });

                    if (freshUser) {
                        session.user.name = freshUser.name;
                        session.user.email = freshUser.email;
                        (session.user as any).role = freshUser.role;
                    }
                } catch (e) {
                    console.error("Eroare la reîmprospătarea sesiunii din DB:", e);
                }
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

export async function getAuthSession() {
    return getServerSession(authOptions);
}
