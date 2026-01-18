
declare namespace JSX {
    interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            src?: string;
            alt?: string;
            ar?: boolean;
            'auto-rotate'?: boolean;
            'camera-controls'?: boolean;
            'shadow-intensity'?: string | number;
            poster?: string;
            exposure?: string;
            loading?: string;
            reveal?: string;
            key?: string | number;
            ref?: any;
        };
    }
}
