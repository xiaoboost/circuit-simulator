declare namespace JSX {
    interface IntrinsicElements {
        child: {
            value?: string;
        } & IntrinsicElements['button'];
    }
}
