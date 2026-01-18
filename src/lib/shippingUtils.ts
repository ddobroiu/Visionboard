
// Tipuri de împachetare
export type PackingType = 'rigid' | 'foldable' | 'rolled';

// Limite DPD International (Classic Road)
export const DPD_LIMITS = {
    MAX_WEIGHT_KG: 31.5,
    MAX_LENGTH_CM: 175,
    MAX_GIRTH_CM: 300 // Formula: Lungime + 2*(Lățime + Înălțime) <= 300cm
};

// Țări acceptate DPD (Zona UE principala)
export const DPD_COUNTRIES = [
    { code: 'RO', name: 'România' },
    { code: 'HU', name: 'Ungaria' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'AT', name: 'Austria' },
    { code: 'DE', name: 'Germania' },
    { code: 'IT', name: 'Italia' },
    { code: 'FR', name: 'Franța' },
    { code: 'ES', name: 'Spania' },
    { code: 'GR', name: 'Grecia' },
    { code: 'BE', name: 'Belgia' },
    { code: 'NL', name: 'Olanda' },
    { code: 'PL', name: 'Polonia' },
    { code: 'CZ', name: 'Cehia' },
    { code: 'SK', name: 'Slovacia' },
    { code: 'DK', name: 'Danemarca' },
    { code: 'SE', name: 'Suedia' },
    { code: 'FI', name: 'Finlanda' },
    { code: 'PT', name: 'Portugalia' },
    { code: 'IE', name: 'Irlanda' },
    { code: 'HR', name: 'Croația' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'EE', name: 'Estonia' },
    { code: 'LV', name: 'Letonia' },
    { code: 'LT', name: 'Lituania' },
    { code: 'LU', name: 'Luxemburg' }
];

interface ProductDimensions {
    width: number;  // cm
    height: number; // cm
    quantity: number;
    type: PackingType;
    materialDensity?: number;
}

interface ShippingResult {
    volumetricWeight: number;
    physicalWeight: number;
    billingWeight: number;
    packageDimensions: {
        length: number;
        width: number;
        height: number;
    };
    details: string;
}

const DENSITIES = {
    BANNER: 0.55,
    MESH: 0.45,
    CANVAS: 2.5,
    STICKER: 0.25,
    PAPER: 0.20,
    RIGID_LIGHT: 1.5,
    RIGID_HEAVY: 4.0,
};

/**
 * Încearcă să extragă dimensiunile (width, height) dintr-un item.
 * PRIORITIZEAZĂ extragerea din TITLU și OPȚIUNI pentru a suprascrie metadata incorectă.
 */
function extractDimensions(item: any): { w: number, h: number } {
    let w = 0, h = 0;

    // 1. PRIMA DATĂ: Scanăm textul (Titlu + Opțiuni) - PRIORITATE MAXIMĂ
    const text = ((item.title || item.name || '') + ' ' + JSON.stringify(item.options || item.metadata || {})).toLowerCase();

    // Regex global: prinde numere (inclusiv zecimale) separate de x, X, *, ×
    const rx = /([0-9]+[.,]?[0-9]*)\s*([xX×*])\s*([0-9]+[.,]?[0-9]*)/gi;

    let match;
    let bestArea = 0;

    while ((match = rx.exec(text)) !== null) {
        const v1 = parseFloat(match[1].replace(',', '.'));
        const v2 = parseFloat(match[3].replace(',', '.'));

        // Filtru de plauzibilitate: >= 10cm pe latura
        if (v1 >= 10 && v2 >= 10) {
            const area = v1 * v2;
            if (area > bestArea) {
                bestArea = area;
                w = v1;
                h = v2;
            }
        }
    }

    // Dacă am găsit dimensiuni în text, le folosim pe acestea!
    if (w > 0 && h > 0) return { w, h };

    // 2. FALLBACK: Metadata explicit
    const meta = item.metadata || {};
    if (meta.width) w = parseFloat(String(meta.width));
    if (meta.height) h = parseFloat(String(meta.height));
    if (w > 0 && h > 0) return { w, h };

    // 3. FALLBACK: Proprietăți root
    if (item.width) w = parseFloat(String(item.width));
    if (item.height) h = parseFloat(String(item.height));

    return { w, h };
}

export function calculateShippingParams(
    params: ProductDimensions,
    volumetricDivisor: number = 6000
): ShippingResult {
    const { width, height, quantity, type } = params;

    const L = Math.max(width, height);
    const l = Math.min(width, height);
    const areaSqm = (width * height) / 10000;

    let packL = 0, packW = 0, packH = 0;
    let density = params.materialDensity || 0.5;

    if (!params.materialDensity) {
        if (type === 'foldable') density = DENSITIES.BANNER;
        else if (type === 'rigid') density = DENSITIES.CANVAS;
        else density = DENSITIES.STICKER;
    }

    let packagingWeight = 0.3;
    if (type === 'rigid') packagingWeight = 0.5 * quantity;

    const physicalWeight = parseFloat(((areaSqm * density * quantity) + packagingWeight).toFixed(2));

    switch (type) {
        case 'rigid':
            packL = L + 5;
            packW = l + 5;
            packH = Math.max(3, 4 * quantity);
            break;

        case 'foldable':
            {
                const totalAreaSqm = areaSqm * quantity;
                packL = 40;
                packW = 30;
                packH = Math.max(5, Math.ceil(totalAreaSqm * 1.5));

                if (packH > 40) {
                    packL = 60;
                    packW = 40;
                    packH = Math.ceil(packH / 2);
                }
            }
            break;

        case 'rolled':
            packL = l + 10;
            packW = 10;
            packH = 10;
            if (packL < 30) packL = 30;

            if (quantity > 50) { packW = 20; packH = 20; }
            else if (quantity > 10) { packW = 15; packH = 15; }
            break;
    }

    const volume = packL * packW * packH;
    const volumetricWeight = parseFloat((volume / volumetricDivisor).toFixed(2));
    const billingWeight = Math.max(physicalWeight, volumetricWeight);

    return {
        volumetricWeight,
        physicalWeight,
        billingWeight,
        packageDimensions: { length: packL, width: packW, height: packH },
        details: `Colet ${type}: ${packL}x${packW}x${packH}cm | Vol: ${volumetricWeight}kg | Fiz: ${physicalWeight}kg`
    };
}

export function determinePackingType(productSlug: string, item: any = {}): PackingType {
    const s = String(productSlug).toLowerCase();
    const name = (item.title || item.name || '').toLowerCase();
    const opts = JSON.stringify(item.options || item.metadata || {}).toLowerCase();

    // CANVAS Logic
    if (s.includes('canvas') || s.includes('tablou') || name.includes('canvas')) {
        // Diferențiere Rigid (cu cadru) vs Rolled (doar print)
        if (s.includes('fara-rama') || s.includes('print-only') ||
            name.includes('fara rama') || name.includes('doar print') ||
            opts.includes('fara rama') || opts.includes('doar print') || opts.includes('fara sasiu')) {
            return 'rolled';
        }
        return 'rigid'; // Default Rigid
    }

    if (s.includes('banner') || s.includes('mesh') || s.includes('steag') || s.includes('panza')) {
        return 'foldable';
    }

    if (s.includes('rigid') || s.includes('panou') ||
        s.includes('bond') || s.includes('alucobond') || s.includes('plexiglass') || s.includes('forex') || s.includes('pvc')) {
        return 'rigid';
    }

    return 'rolled';
}

export function estimateDensity(productSlug: string): number {
    const s = String(productSlug).toLowerCase();
    if (s.includes('banner')) return DENSITIES.BANNER;
    if (s.includes('mesh')) return DENSITIES.MESH;
    if (s.includes('canvas')) return DENSITIES.CANVAS;
    if (s.includes('bond') || s.includes('alucobond')) return DENSITIES.RIGID_HEAVY;
    if (s.includes('pvc') || s.includes('forex')) return 2.0;
    if (s.includes('polipropilena')) return DENSITIES.RIGID_LIGHT;
    return DENSITIES.STICKER;
}


// --- CALCUL COST ---
const ZONES: Record<string, { base: number, kgPrice: number }> = {
    'HU': { base: 40, kgPrice: 2 },
    'BG': { base: 40, kgPrice: 2 },
    'AT': { base: 60, kgPrice: 4 },
    'DE': { base: 60, kgPrice: 4 },
    'GR': { base: 60, kgPrice: 4 },
    'CZ': { base: 60, kgPrice: 4 },
    'PL': { base: 60, kgPrice: 4 },
    'IT': { base: 70, kgPrice: 5 },
    'FR': { base: 80, kgPrice: 5 },
    'ES': { base: 90, kgPrice: 6 },
    'BE': { base: 80, kgPrice: 5 },
    'NL': { base: 80, kgPrice: 5 },
    'EUROPE': { base: 100, kgPrice: 8 }
};

export function getEstimatedShippingCost(countryCode: string | null | undefined, items: any[]): number {
    let code = (countryCode || 'RO').toUpperCase().trim();
    if (code === 'ROMANIA') code = 'RO';

    if (code === 'RO') return 19.99;

    let totalWeight = 0;

    items.forEach(item => {
        const q = Number(item.quantity || item.qty || 1);
        const { w, h } = extractDimensions(item); // Folosim noua funcție

        if (w > 0 && h > 0) {
            const slug = item.slug || item.name || '';
            const type = determinePackingType(slug, item);
            const res = calculateShippingParams({ width: w, height: h, quantity: q, type });
            totalWeight += res.billingWeight;
        } else {
            const name = String(item.slug || item.name || '').toLowerCase();
            if (name.includes('rollup') || name.includes('roll-up')) totalWeight += (2.5 * q);
            else if (name.includes('pop-up') || name.includes('spider')) totalWeight += (15.0 * q);
            // Fallback mai mic pentru produse necunoscute
            else totalWeight += (0.5 * q);
        }
    });

    totalWeight = Math.max(1, Math.ceil(totalWeight));
    const rate = ZONES[code] || ZONES['EUROPE'];

    return Math.ceil(rate.base + (totalWeight * rate.kgPrice));
}

// --- VALIDARE LIMITE DPD ---
export function validateDpdShipment(items: any[]): { valid: boolean; error?: string; invalidItem?: any } {
    for (const item of items) {
        const q = Number(item.quantity || 1);
        const { w, h } = extractDimensions(item);

        if (w > 0 && h > 0) {
            const slug = item.slug || item.name || '';
            const type = determinePackingType(slug, item);
            const { packageDimensions, billingWeight } = calculateShippingParams({
                width: w, height: h, quantity: q, type
            });

            // 1. Greutate
            if (billingWeight > DPD_LIMITS.MAX_WEIGHT_KG) {
                return {
                    valid: false,
                    error: `Produsul "${item.title || item.name}" depășește greutatea maximă admisă (31.5kg).`,
                    invalidItem: item
                };
            }

            // 2. Lungime
            if (packageDimensions.length > DPD_LIMITS.MAX_LENGTH_CM) {
                return {
                    valid: false,
                    error: `Produsul "${item.title || item.name}" are o lungime de ${Math.round(packageDimensions.length)}cm (max admis ${DPD_LIMITS.MAX_LENGTH_CM}cm). Te rugăm să alegi o dimensiune mai mică.`,
                    invalidItem: item
                };
            }

            // 3. Circumferință (Girth)
            const girth = packageDimensions.length + 2 * (packageDimensions.width + packageDimensions.height);
            if (girth > DPD_LIMITS.MAX_GIRTH_CM) {
                return {
                    valid: false,
                    error: `Produsul "${item.title || item.name}" depășește circumferința maximă admisă pentru livrare internațională.`,
                    invalidItem: item
                };
            }
        }
    }
    return { valid: true };
}
