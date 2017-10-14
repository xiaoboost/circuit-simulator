interface Window {
    $ENV: {
        readonly NODE_ENV: 'development' | 'production' | 'testing';
    };
    $DATE: {
        readonly SVG_NS: 'http://www.w3.org/2000/svg';
    };
    $DEBUG: any;
}
