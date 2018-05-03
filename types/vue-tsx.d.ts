declare namespace JSX {
    // Vue 公共组件
    namespace Vue {
        type EventHandler<T extends Event> = (e: T) => any;

        /**
         * Vue 修饰符事件
         *  - `&`: passive
         *  - `!`: capture
         *  - `~`: once
         */
        interface VueEventHandler {
            '&input'?: EventHandler<UIEvent>;
            '&!mousemove'?: EventHandler<MouseEvent>;
            '&!mouseleave'?: EventHandler<MouseEvent>;
            'mousemove'?: EventHandler<MouseEvent>;
            'mouseleave'?: EventHandler<MouseEvent>;
        }

        interface VueAttributes {
            'class'?:
                string |
                { [className: string]: boolean } |
                Array<string | { [className: string]: boolean }>;

            ref?: string;
            key?: string | number;
            refInFor?: boolean;
            staticClass?: string;
        }

        interface TransitionPropsBase {
            name?: string;
            appear?: string;
            css?: boolean;
            type?: string;
            enterClass?: string;
            leaveClass?: string;
            enterActiveClass?: string;
            leaveActiveClass?: string;
            appearClass?: string;
            appearActiveClass?: string;
        
            onBeforeEnter?: (el: Element) => void;
            onEnter?: (el: Element, done: () => void) => void;
            onAfterEnter?: (el: Element) => void;
            onEnterCancelled?: (el: Element) => void;
        
            onBeforeLeave?: (el: Element) => void;
            onLeave?: (el: Element, done: () => void) => void;
            onAfterLeave?: (el: Element) => void;
            onLeaveCancelled?: (el: Element) => void;
        
            onBeforeAppear?: (el: Element) => void;
            onAppear?: (el: Element, done: () => void) => void;
            onAfterAppear?: (el: Element) => void;
            onAppearCancelled?: (el: Element) => void;
        }
        
        interface TransitionProps extends TransitionPropsBase {
            mode?: string;
        }
        
        interface TransitionGroupProps extends TransitionPropsBase {
            tag?: string;
            moveClass?: string;
        }
        
        interface KeepAliveProps {
            include?: string | RegExp | (string | RegExp)[];
            exclude?: string | RegExp | (string | RegExp)[];
        }

        interface DOMEvents extends VueAttributes {
            // Clipboard Events
            onCopy?: EventHandler<ClipboardEvent>;
            onCut?: EventHandler<ClipboardEvent>;
            onPaste?: EventHandler<ClipboardEvent>;

            // Composition Events
            onCompositionend?: EventHandler<CompositionEvent>;
            onCompositionstart?: EventHandler<CompositionEvent>;
            onCompositionupdate?: EventHandler<CompositionEvent>;

            // drag drop events
            onDrag?: EventHandler<DragEvent>;
            onDragend?: EventHandler<DragEvent>;
            onDragenter?: EventHandler<DragEvent>;
            onDragexit?: EventHandler<DragEvent>;
            onDragleave?: EventHandler<DragEvent>;
            onDragover?: EventHandler<DragEvent>;
            onDragstart?: EventHandler<DragEvent>;
            onDrop?: EventHandler<DragEvent>;

            // Focus Events
            onFocus?: EventHandler<FocusEvent>;
            onBlur?: EventHandler<FocusEvent>;

            // Image events
            onLoad?: EventHandler<Event>;
            onError?: EventHandler<Event>;

            // Keyboard Events
            onKeydown?: EventHandler<KeyboardEvent>;
            onKeypress?: EventHandler<KeyboardEvent>;
            onKeyup?: EventHandler<KeyboardEvent>;

            // MouseEvents
            onClick?: EventHandler<MouseEvent>;
            onContextmenu?: EventHandler<MouseEvent>;
            onDblclick?: EventHandler<MouseEvent>;
            onMousedown?: EventHandler<MouseEvent>;
            onMouseenter?: EventHandler<MouseEvent>;
            onMouseleave?: EventHandler<MouseEvent>;
            onMousemove?: EventHandler<MouseEvent>;
            onMouseout?: EventHandler<MouseEvent>;
            onMouseover?: EventHandler<MouseEvent>;
            onMouseup?: EventHandler<MouseEvent>;

            // Touch Events
            onTouchcancel?: EventHandler<TouchEvent>;
            onTouchend?: EventHandler<TouchEvent>;
            onTouchmove?: EventHandler<TouchEvent>;
            onTouchstart?: EventHandler<TouchEvent>;

            // Selection events
            onSelect?: EventHandler<Event>;

            // UI Events
            onScroll?: EventHandler<UIEvent>;

            // Wheel Events
            onWheel?: EventHandler<WheelEvent>;

            // Animation Events
            onAnimationstart?: EventHandler<AnimationEvent>;
            onAnimationend?: EventHandler<AnimationEvent>;
            onAnimationiteration?: EventHandler<AnimationEvent>;

            // Transition Events
            onTransitionend?: EventHandler<TransitionEvent>;
            onTransitionstart?: EventHandler<TransitionEvent>;
        }

        interface DOMAttributes extends DOMEvents {
            // Clipboard Events
            nativeOnCopy?: EventHandler<ClipboardEvent>;
            nativeOnCut?: EventHandler<ClipboardEvent>;
            nativeOnPaste?: EventHandler<ClipboardEvent>;

            // Composition Events
            nativeOnCompositionend?: EventHandler<CompositionEvent>;
            nativeOnCompositionstart?: EventHandler<CompositionEvent>;
            nativeOnCompositionupdate?: EventHandler<CompositionEvent>;

            // drag drop events
            nativeOnDrag?: EventHandler<DragEvent>;
            nativeOnDragend?: EventHandler<DragEvent>;
            nativeOnDragenter?: EventHandler<DragEvent>;
            nativeOnDragexit?: EventHandler<DragEvent>;
            nativeOnDragleave?: EventHandler<DragEvent>;
            nativeOnDragover?: EventHandler<DragEvent>;
            nativeOnDragstart?: EventHandler<DragEvent>;
            nativeOnDrop?: EventHandler<DragEvent>;

            // Focus Events
            nativeOnFocus?: EventHandler<FocusEvent>;
            nativeOnBlur?: EventHandler<FocusEvent>;

            // Image events
            nativeOnLoad?: EventHandler<Event>;
            nativeOnError?: EventHandler<Event>;

            // Keyboard Events
            nativeOnKeydown?: EventHandler<KeyboardEvent>;
            nativeOnKeypress?: EventHandler<KeyboardEvent>;
            nativeOnKeyup?: EventHandler<KeyboardEvent>;

            // MouseEvents
            nativeOnClick?: EventHandler<MouseEvent>;
            nativeOnContextmenu?: EventHandler<MouseEvent>;
            nativeOnDblclick?: EventHandler<MouseEvent>;
            nativeOnMousedown?: EventHandler<MouseEvent>;
            nativeOnMouseenter?: EventHandler<MouseEvent>;
            nativeOnMouseleave?: EventHandler<MouseEvent>;
            nativeOnMousemove?: EventHandler<MouseEvent>;
            nativeOnMouseout?: EventHandler<MouseEvent>;
            nativeOnMouseover?: EventHandler<MouseEvent>;
            nativeOnMouseup?: EventHandler<MouseEvent>;

            // Touch Events
            nativeOnTouchcancel?: EventHandler<TouchEvent>;
            nativeOnTouchend?: EventHandler<TouchEvent>;
            nativeOnTouchmove?: EventHandler<TouchEvent>;
            nativeOnTouchstart?: EventHandler<TouchEvent>;

            // Selection events
            nativeOnSelect?: EventHandler<Event>;

            // UI Events
            nativeOnScroll?: EventHandler<UIEvent>;

            // Wheel Events
            nativeOnWheel?: EventHandler<WheelEvent>;

            // Animation Events
            nativeOnAnimationstart?: EventHandler<AnimationEvent>;
            nativeOnAnimationend?: EventHandler<AnimationEvent>;
            nativeOnAnimationiteration?: EventHandler<AnimationEvent>;

            // Transition Events
            nativeOnTransitionend?: EventHandler<TransitionEvent>;
            nativeOnTransitionstart?: EventHandler<TransitionEvent>;
        }

        interface HTMLAttributes extends DOMAttributes {
            // Standard HTML Attributes
            accessKey?: string;
            className?: string;
            contentEditable?: boolean;
            contextMenu?: string;
            dir?: string;
            draggable?: boolean;
            hidden?: boolean;
            id?: string;
            lang?: string;
            placeholder?: string;
            slot?: string;
            spellCheck?: boolean;
            style?: Partial<CSSStyleDeclaration>;
            tabIndex?: number;
            title?: string;

            // WAI-ARIA
            role?: string;

            // RDFa Attributes
            about?: string;
            datatype?: string;
            inlist?: any;
            prefix?: string;
            property?: string;
            resource?: string;
            typeof?: string;
            vocab?: string;
        }

        interface AnchorHTMLAttributes extends HTMLAttributes {
            download?: any;
            href?: string;
            hrefLang?: string;
            media?: string;
            rel?: string;
            target?: string;
            type?: string;
            as?: string;
        }

        interface AudioHTMLAttributes extends MediaHTMLAttributes {}

        interface AreaHTMLAttributes extends HTMLAttributes {
            alt?: string;
            coords?: string;
            download?: any;
            href?: string;
            hrefLang?: string;
            media?: string;
            rel?: string;
            shape?: string;
            target?: string;
        }

        interface BaseHTMLAttributes extends HTMLAttributes {
            href?: string;
            target?: string;
        }

        interface BlockquoteHTMLAttributes extends HTMLAttributes {
            cite?: string;
        }

        interface ButtonHTMLAttributes extends HTMLAttributes {
            autoFocus?: boolean;
            disabled?: boolean;
            form?: string;
            formAction?: string;
            formEncType?: string;
            formMethod?: string;
            formNoValidate?: boolean;
            formTarget?: string;
            name?: string;
            type?: string;
            value?: string | string[] | number;
        }

        interface CanvasHTMLAttributes extends HTMLAttributes {
            height?: number | string;
            width?: number | string;
        }

        interface ColHTMLAttributes extends HTMLAttributes {
            span?: number;
            width?: number | string;
        }

        interface ColgroupHTMLAttributes extends HTMLAttributes {
            span?: number;
        }

        interface DetailsHTMLAttributes extends HTMLAttributes {
            open?: boolean;
        }

        interface DelHTMLAttributes extends HTMLAttributes {
            cite?: string;
            dateTime?: string;
        }

        interface DialogHTMLAttributes extends HTMLAttributes {
            open?: boolean;
        }

        interface EmbedHTMLAttributes extends HTMLAttributes {
            height?: number | string;
            src?: string;
            type?: string;
            width?: number | string;
        }

        interface FieldsetHTMLAttributes extends HTMLAttributes {
            disabled?: boolean;
            form?: string;
            name?: string;
        }

        interface FormHTMLAttributes extends HTMLAttributes {
            acceptCharset?: string;
            action?: string;
            autoComplete?: string;
            encType?: string;
            method?: string;
            name?: string;
            noValidate?: boolean;
            target?: string;
        }

        interface HtmlHTMLAttributes extends HTMLAttributes {
            manifest?: string;
        }

        interface IframeHTMLAttributes extends HTMLAttributes {
            allowFullScreen?: boolean;
            allowTransparency?: boolean;
            frameBorder?: number | string;
            height?: number | string;
            marginHeight?: number;
            marginWidth?: number;
            name?: string;
            sandbox?: string;
            scrolling?: string;
            seamless?: boolean;
            src?: string;
            srcDoc?: string;
            width?: number | string;
        }

        interface ImgHTMLAttributes extends HTMLAttributes {
            alt?: string;
            crossOrigin?: "anonymous" | "use-credentials" | "";
            height?: number | string;
            sizes?: string;
            src?: string;
            srcSet?: string;
            useMap?: string;
            width?: number | string;
        }

        interface InsHTMLAttributes extends HTMLAttributes {
            cite?: string;
            dateTime?: string;
        }

        interface InputHTMLAttributes extends HTMLAttributes {
            accept?: string;
            alt?: string;
            autoComplete?: string;
            autoFocus?: boolean;
            capture?: boolean; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
            checked?: boolean;
            crossOrigin?: string;
            disabled?: boolean;
            form?: string;
            formAction?: string;
            formEncType?: string;
            formMethod?: string;
            formNoValidate?: boolean;
            formTarget?: string;
            height?: number | string;
            list?: string;
            max?: number | string;
            maxLength?: number;
            min?: number | string;
            minLength?: number;
            multiple?: boolean;
            name?: string;
            pattern?: string;
            placeholder?: string;
            readOnly?: boolean;
            required?: boolean;
            size?: number;
            src?: string;
            step?: number | string;
            type?: string;
            value?: string | string[] | number;
            width?: number | string;

            onInput?: EventHandler<Event>;
        }

        interface KeygenHTMLAttributes extends HTMLAttributes {
            autoFocus?: boolean;
            challenge?: string;
            disabled?: boolean;
            form?: string;
            keyType?: string;
            keyParams?: string;
            name?: string;
        }

        interface LabelHTMLAttributes extends HTMLAttributes {
            form?: string;
            htmlFor?: string;
        }

        interface LiHTMLAttributes extends HTMLAttributes {
            value?: string | string[] | number;
        }

        interface LinkHTMLAttributes extends HTMLAttributes {
            as?: string;
            crossOrigin?: string;
            href?: string;
            hrefLang?: string;
            integrity?: string;
            media?: string;
            rel?: string;
            sizes?: string;
            type?: string;
        }

        interface MapHTMLAttributes extends HTMLAttributes {
            name?: string;
        }

        interface MenuHTMLAttributes extends HTMLAttributes {
            type?: string;
        }

        interface MediaHTMLAttributes extends HTMLAttributes {
            autoPlay?: boolean;
            controls?: boolean;
            controlsList?: string;
            crossOrigin?: string;
            loop?: boolean;
            mediaGroup?: string;
            muted?: boolean;
            playsinline?: boolean;
            preload?: string;
            src?: string;
        }

        interface MetaHTMLAttributes extends HTMLAttributes {
            charSet?: string;
            content?: string;
            httpEquiv?: string;
            name?: string;
        }

        interface MeterHTMLAttributes extends HTMLAttributes {
            form?: string;
            high?: number;
            low?: number;
            max?: number | string;
            min?: number | string;
            optimum?: number;
            value?: string | string[] | number;
        }

        interface QuoteHTMLAttributes extends HTMLAttributes {
            cite?: string;
        }

        interface ObjectHTMLAttributes extends HTMLAttributes {
            classID?: string;
            data?: string;
            form?: string;
            height?: number | string;
            name?: string;
            type?: string;
            useMap?: string;
            width?: number | string;
            wmode?: string;
        }

        interface OlHTMLAttributes extends HTMLAttributes {
            reversed?: boolean;
            start?: number;
        }

        interface OptgroupHTMLAttributes extends HTMLAttributes {
            disabled?: boolean;
            label?: string;
        }

        interface OptionHTMLAttributes extends HTMLAttributes {
            disabled?: boolean;
            label?: string;
            selected?: boolean;
            value?: string | string[] | number;
        }

        interface OutputHTMLAttributes extends HTMLAttributes {
            form?: string;
            htmlFor?: string;
            name?: string;
        }

        interface ParamHTMLAttributes extends HTMLAttributes {
            name?: string;
            value?: string | string[] | number;
        }

        interface ProgressHTMLAttributes extends HTMLAttributes {
            max?: number | string;
            value?: string | string[] | number;
        }

        interface ScriptHTMLAttributes extends HTMLAttributes {
            async?: boolean;
            charSet?: string;
            crossOrigin?: string;
            defer?: boolean;
            integrity?: string;
            noModule?: boolean;
            nonce?: string;
            src?: string;
            type?: string;
        }

        interface SelectHTMLAttributes extends HTMLAttributes {
            autoFocus?: boolean;
            disabled?: boolean;
            form?: string;
            multiple?: boolean;
            name?: string;
            required?: boolean;
            size?: number;
            value?: string | string[] | number;
            // onChange?: ChangeEventHandler;
        }

        interface SourceHTMLAttributes extends HTMLAttributes {
            media?: string;
            sizes?: string;
            src?: string;
            srcSet?: string;
            type?: string;
        }

        interface StyleHTMLAttributes extends HTMLAttributes {
            media?: string;
            nonce?: string;
            scoped?: boolean;
            type?: string;
        }

        interface TableHTMLAttributes extends HTMLAttributes {
            cellPadding?: number | string;
            cellSpacing?: number | string;
            summary?: string;
        }

        interface TextareaHTMLAttributes extends HTMLAttributes {
            autoComplete?: string;
            autoFocus?: boolean;
            cols?: number;
            dirName?: string;
            disabled?: boolean;
            form?: string;
            maxLength?: number;
            minLength?: number;
            name?: string;
            placeholder?: string;
            readOnly?: boolean;
            required?: boolean;
            rows?: number;
            value?: string | string[] | number;
            wrap?: string;

            onInput?: EventHandler<Event>;
        }

        interface TdHTMLAttributes extends HTMLAttributes {
            colSpan?: number;
            headers?: string;
            rowSpan?: number;
            scope?: string;
        }

        interface ThHTMLAttributes extends HTMLAttributes {
            colSpan?: number;
            headers?: string;
            rowSpan?: number;
            scope?: string;
        }

        interface TimeHTMLAttributes extends HTMLAttributes {
            dateTime?: string;
        }

        interface TrackHTMLAttributes extends HTMLAttributes {
            default?: boolean;
            kind?: string;
            label?: string;
            src?: string;
            srcLang?: string;
        }

        interface VideoHTMLAttributes extends MediaHTMLAttributes {
            height?: number | string;
            playsInline?: boolean;
            poster?: string;
            width?: number | string;
        }

        interface WebViewHTMLAttributes extends HTMLAttributes {
            allowFullScreen?: boolean;
            allowpopups?: boolean;
            autoFocus?: boolean;
            autosize?: boolean;
            blinkfeatures?: string;
            disableblinkfeatures?: string;
            disableguestresize?: boolean;
            disablewebsecurity?: boolean;
            guestinstance?: string;
            httpreferrer?: string;
            nodeintegration?: boolean;
            partition?: string;
            plugins?: boolean;
            preload?: string;
            src?: string;
            useragent?: string;
            webpreferences?: string;
        }

        interface SVGAttributes extends DOMAttributes {
            // Attributes which also defined in HTMLAttributes
            color?: string;
            height?: number | string;
            id?: string;
            lang?: string;
            max?: number | string;
            media?: string;
            method?: string;
            min?: number | string;
            name?: string;
            style?: CSSStyleDeclaration;
            target?: string;
            type?: string;
            width?: number | string;

            // Other HTML properties supported by SVG elements in browsers
            role?: string;
            tabIndex?: number;

            // SVG Specific attributes
            accentHeight?: number | string;
            accumulate?: "none" | "sum";
            additive?: "replace" | "sum";
            alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit";
            allowReorder?: "no" | "yes";
            alphabetic?: number | string;
            amplitude?: number | string;
            arabicForm?: "initial" | "medial" | "terminal" | "isolated";
            ascent?: number | string;
            attributeName?: string;
            attributeType?: string;
            autoReverse?: number | string;
            azimuth?: number | string;
            baseFrequency?: number | string;
            baselineShift?: number | string;
            baseProfile?: number | string;
            bbox?: number | string;
            begin?: number | string;
            bias?: number | string;
            by?: number | string;
            calcMode?: number | string;
            capHeight?: number | string;
            clip?: number | string;
            clipPath?: string;
            clipPathUnits?: number | string;
            clipRule?: number | string;
            colorInterpolation?: number | string;
            colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
            colorProfile?: number | string;
            colorRendering?: number | string;
            contentScriptType?: number | string;
            contentStyleType?: number | string;
            cursor?: number | string;
            cx?: number | string;
            cy?: number | string;
            d?: string;
            decelerate?: number | string;
            descent?: number | string;
            diffuseConstant?: number | string;
            direction?: number | string;
            display?: number | string;
            divisor?: number | string;
            dominantBaseline?: number | string;
            dur?: number | string;
            dx?: number | string;
            dy?: number | string;
            edgeMode?: number | string;
            elevation?: number | string;
            enableBackground?: number | string;
            end?: number | string;
            exponent?: number | string;
            externalResourcesRequired?: number | string;
            fill?: string;
            fillOpacity?: number | string;
            fillRule?: "nonzero" | "evenodd" | "inherit";
            filter?: string;
            filterRes?: number | string;
            filterUnits?: number | string;
            floodColor?: number | string;
            floodOpacity?: number | string;
            focusable?: number | string;
            fontFamily?: string;
            fontSize?: number | string;
            fontSizeAdjust?: number | string;
            fontStretch?: number | string;
            fontStyle?: number | string;
            fontVariant?: number | string;
            fontWeight?: number | string;
            format?: number | string;
            from?: number | string;
            fx?: number | string;
            fy?: number | string;
            g1?: number | string;
            g2?: number | string;
            glyphName?: number | string;
            glyphOrientationHorizontal?: number | string;
            glyphOrientationVertical?: number | string;
            glyphRef?: number | string;
            gradientTransform?: string;
            gradientUnits?: string;
            hanging?: number | string;
            horizAdvX?: number | string;
            horizOriginX?: number | string;
            ideographic?: number | string;
            imageRendering?: number | string;
            in2?: number | string;
            in?: string;
            intercept?: number | string;
            k1?: number | string;
            k2?: number | string;
            k3?: number | string;
            k4?: number | string;
            k?: number | string;
            kernelMatrix?: number | string;
            kernelUnitLength?: number | string;
            kerning?: number | string;
            keyPoints?: number | string;
            keySplines?: number | string;
            keyTimes?: number | string;
            lengthAdjust?: number | string;
            letterSpacing?: number | string;
            lightingColor?: number | string;
            limitingConeAngle?: number | string;
            local?: number | string;
            markerEnd?: string;
            markerHeight?: number | string;
            markerMid?: string;
            markerStart?: string;
            markerUnits?: number | string;
            markerWidth?: number | string;
            mask?: string;
            maskContentUnits?: number | string;
            maskUnits?: number | string;
            mathematical?: number | string;
            mode?: number | string;
            numOctaves?: number | string;
            offset?: number | string;
            opacity?: number | string;
            operator?: number | string;
            order?: number | string;
            orient?: number | string;
            orientation?: number | string;
            origin?: number | string;
            overflow?: number | string;
            overlinePosition?: number | string;
            overlineThickness?: number | string;
            paintOrder?: number | string;
            panose1?: number | string;
            pathLength?: number | string;
            patternContentUnits?: string;
            patternTransform?: number | string;
            patternUnits?: string;
            pointerEvents?: number | string;
            points?: string;
            pointsAtX?: number | string;
            pointsAtY?: number | string;
            pointsAtZ?: number | string;
            preserveAlpha?: number | string;
            preserveAspectRatio?: string;
            primitiveUnits?: number | string;
            r?: number | string;
            radius?: number | string;
            refX?: number | string;
            refY?: number | string;
            renderingIntent?: number | string;
            repeatCount?: number | string;
            repeatDur?: number | string;
            requiredExtensions?: number | string;
            requiredFeatures?: number | string;
            restart?: number | string;
            result?: string;
            rotate?: number | string;
            rx?: number | string;
            ry?: number | string;
            scale?: number | string;
            seed?: number | string;
            shapeRendering?: number | string;
            slope?: number | string;
            spacing?: number | string;
            specularConstant?: number | string;
            specularExponent?: number | string;
            speed?: number | string;
            spreadMethod?: string;
            startOffset?: number | string;
            stdDeviation?: number | string;
            stemh?: number | string;
            stemv?: number | string;
            stitchTiles?: number | string;
            stopColor?: string;
            stopOpacity?: number | string;
            strikethroughPosition?: number | string;
            strikethroughThickness?: number | string;
            string?: number | string;
            stroke?: string;
            strokeDasharray?: string | number;
            strokeDashoffset?: string | number;
            strokeLinecap?: "butt" | "round" | "square" | "inherit";
            strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
            strokeMiterlimit?: number | string;
            strokeOpacity?: number | string;
            strokeWidth?: number | string;
            surfaceScale?: number | string;
            systemLanguage?: number | string;
            tableValues?: number | string;
            targetX?: number | string;
            targetY?: number | string;
            textAnchor?: string;
            textDecoration?: number | string;
            textLength?: number | string;
            textRendering?: number | string;
            to?: number | string;
            transform?: string;
            u1?: number | string;
            u2?: number | string;
            underlinePosition?: number | string;
            underlineThickness?: number | string;
            unicode?: number | string;
            unicodeBidi?: number | string;
            unicodeRange?: number | string;
            unitsPerEm?: number | string;
            vAlphabetic?: number | string;
            values?: string;
            vectorEffect?: number | string;
            version?: string;
            vertAdvY?: number | string;
            vertOriginX?: number | string;
            vertOriginY?: number | string;
            vHanging?: number | string;
            vIdeographic?: number | string;
            viewBox?: string;
            viewTarget?: number | string;
            visibility?: number | string;
            vMathematical?: number | string;
            widths?: number | string;
            wordSpacing?: number | string;
            writingMode?: number | string;
            x1?: number | string;
            x2?: number | string;
            x?: number | string;
            xChannelSelector?: string;
            xHeight?: number | string;
            xlinkActuate?: string;
            xlinkArcrole?: string;
            xlinkHref?: string;
            xlinkRole?: string;
            xlinkShow?: string;
            xlinkTitle?: string;
            xlinkType?: string;
            xmlBase?: string;
            xmlLang?: string;
            xmlns?: string;
            xmlnsXlink?: string;
            xmlSpace?: string;
            y1?: number | string;
            y2?: number | string;
            y?: number | string;
            yChannelSelector?: string;
            z?: number | string;
            zoomAndPan?: string;
        }
    }

    // Custom
    namespace Custom {
        interface InputValidateRule {
            required?: boolean;
            pattern?: RegExp;
            message?: string;
            validator?(value: string): boolean;
        }

        interface InputVerifiable {
            value?: string;
            placeholder?: string;
            maxlength?: number;
            rules?: InputValidateRule | InputValidateRule[];
            onInput?: (val: string) => any;
        }

        interface ElectronicPoint {
            r?: number;
            classList?: JSX.Vue.VueAttributes['class'];
        }

        interface PartComponent {
            // TODO:
            value?: any;
        }

        interface LineComponent {
            // TODO:
            value?: any;
        }
    }

    interface IntrinsicElements {
        // Custom Element
        'action-menu': Vue.HTMLAttributes;
        'slider-menu': Vue.HTMLAttributes;
        'parts-panel': Vue.HTMLAttributes;
        'main-config': Vue.HTMLAttributes;
        'drawing-main': Vue.HTMLAttributes;
        'input-verifiable': Vue.HTMLAttributes & Custom.InputVerifiable;
        'electronic-point': Vue.SVGAttributes & Custom.ElectronicPoint;
        'part-component': Vue.SVGAttributes & Custom.PartComponent;
        'line-component': Vue.SVGAttributes & Custom.LineComponent;

        // Vue Element
        transition: Vue.TransitionProps;
        transitionGroup: Vue.TransitionGroupProps;
        'keep-alive': Vue.KeepAliveProps;

        // HTML
        a: Vue.AnchorHTMLAttributes;
        abbr: Vue.HTMLAttributes;
        address: Vue.HTMLAttributes;
        area: Vue.AreaHTMLAttributes;
        article: Vue.HTMLAttributes;
        aside: Vue.HTMLAttributes;
        audio: Vue.AudioHTMLAttributes;
        b: Vue.HTMLAttributes;
        base: Vue.BaseHTMLAttributes;
        bdi: Vue.HTMLAttributes;
        bdo: Vue.HTMLAttributes;
        big: Vue.HTMLAttributes;
        blockquote: Vue.BlockquoteHTMLAttributes;
        body: Vue.HTMLAttributes;
        br: Vue.HTMLAttributes;
        button: Vue.ButtonHTMLAttributes;
        canvas: Vue.CanvasHTMLAttributes;
        caption: Vue.HTMLAttributes;
        cite: Vue.HTMLAttributes;
        code: Vue.HTMLAttributes;
        col: Vue.ColHTMLAttributes;
        colgroup: Vue.ColgroupHTMLAttributes;
        data: Vue.HTMLAttributes;
        datalist: Vue.HTMLAttributes;
        dd: Vue.HTMLAttributes;
        del: Vue.DelHTMLAttributes;
        details: Vue.DetailsHTMLAttributes;
        dfn: Vue.HTMLAttributes;
        dialog: Vue.DialogHTMLAttributes;
        div: Vue.HTMLAttributes;
        dl: Vue.HTMLAttributes;
        dt: Vue.HTMLAttributes;
        em: Vue.HTMLAttributes;
        embed: Vue.EmbedHTMLAttributes;
        fieldset: Vue.FieldsetHTMLAttributes;
        figcaption: Vue.HTMLAttributes;
        figure: Vue.HTMLAttributes;
        footer: Vue.HTMLAttributes;
        form: Vue.FormHTMLAttributes;
        h1: Vue.HTMLAttributes;
        h2: Vue.HTMLAttributes;
        h3: Vue.HTMLAttributes;
        h4: Vue.HTMLAttributes;
        h5: Vue.HTMLAttributes;
        h6: Vue.HTMLAttributes;
        head: Vue.HTMLAttributes;
        header: Vue.HTMLAttributes;
        hgroup: Vue.HTMLAttributes;
        hr: Vue.HTMLAttributes;
        html: Vue.HtmlHTMLAttributes;
        i: Vue.HTMLAttributes;
        iframe: Vue.IframeHTMLAttributes;
        img: Vue.ImgHTMLAttributes;
        input: Vue.InputHTMLAttributes;
        ins: Vue.InsHTMLAttributes;
        kbd: Vue.HTMLAttributes;
        keygen: Vue.KeygenHTMLAttributes;
        label: Vue.LabelHTMLAttributes;
        legend: Vue.HTMLAttributes;
        li: Vue.LiHTMLAttributes;
        link: Vue.LinkHTMLAttributes;
        main: Vue.HTMLAttributes;
        map: Vue.MapHTMLAttributes;
        mark: Vue.HTMLAttributes;
        menu: Vue.MenuHTMLAttributes;
        menuitem: Vue.HTMLAttributes;
        meta: Vue.MetaHTMLAttributes;
        meter: Vue.MeterHTMLAttributes;
        nav: Vue.HTMLAttributes;
        noindex: Vue.HTMLAttributes;
        noscript: Vue.HTMLAttributes;
        object: Vue.ObjectHTMLAttributes;
        ol: Vue.OlHTMLAttributes;
        optgroup: Vue.OptgroupHTMLAttributes;
        option: Vue.OptionHTMLAttributes;
        output: Vue.OutputHTMLAttributes;
        p: Vue.HTMLAttributes;
        param: Vue.ParamHTMLAttributes;
        picture: Vue.HTMLAttributes;
        pre: Vue.HTMLAttributes;
        progress: Vue.ProgressHTMLAttributes;
        q: Vue.QuoteHTMLAttributes;
        rp: Vue.HTMLAttributes;
        rt: Vue.HTMLAttributes;
        ruby: Vue.HTMLAttributes;
        s: Vue.HTMLAttributes;
        samp: Vue.HTMLAttributes;
        script: Vue.ScriptHTMLAttributes;
        section: Vue.HTMLAttributes;
        select: Vue.SelectHTMLAttributes;
        small: Vue.HTMLAttributes;
        source: Vue.SourceHTMLAttributes;
        span: Vue.HTMLAttributes;
        strong: Vue.HTMLAttributes;
        style: Vue.StyleHTMLAttributes;
        sub: Vue.HTMLAttributes;
        summary: Vue.HTMLAttributes;
        sup: Vue.HTMLAttributes;
        table: Vue.TableHTMLAttributes;
        tbody: Vue.HTMLAttributes;
        td: Vue.TdHTMLAttributes;
        textarea: Vue.TextareaHTMLAttributes;
        tfoot: Vue.HTMLAttributes;
        th: Vue.ThHTMLAttributes;
        thead: Vue.HTMLAttributes;
        time: Vue.TimeHTMLAttributes;
        title: Vue.HTMLAttributes;
        tr: Vue.HTMLAttributes;
        track: Vue.TrackHTMLAttributes;
        u: Vue.HTMLAttributes;
        ul: Vue.HTMLAttributes;
        "var": Vue.HTMLAttributes;
        video: Vue.VideoHTMLAttributes;
        wbr: Vue.HTMLAttributes;
        webview: Vue.WebViewHTMLAttributes;

        // SVG
        svg: Vue.SVGAttributes;

        animate: Vue.SVGAttributes; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
        animateTransform: Vue.SVGAttributes; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
        circle: Vue.SVGAttributes;
        clipPath: Vue.SVGAttributes;
        defs: Vue.SVGAttributes;
        desc: Vue.SVGAttributes;
        ellipse: Vue.SVGAttributes;
        feBlend: Vue.SVGAttributes;
        feColorMatrix: Vue.SVGAttributes;
        feComponentTransfer: Vue.SVGAttributes;
        feComposite: Vue.SVGAttributes;
        feConvolveMatrix: Vue.SVGAttributes;
        feDiffuseLighting: Vue.SVGAttributes;
        feDisplacementMap: Vue.SVGAttributes;
        feDistantLight: Vue.SVGAttributes;
        feFlood: Vue.SVGAttributes;
        feFuncA: Vue.SVGAttributes;
        feFuncB: Vue.SVGAttributes;
        feFuncG: Vue.SVGAttributes;
        feFuncR: Vue.SVGAttributes;
        feGaussianBlur: Vue.SVGAttributes;
        feImage: Vue.SVGAttributes;
        feMerge: Vue.SVGAttributes;
        feMergeNode: Vue.SVGAttributes;
        feMorphology: Vue.SVGAttributes;
        feOffset: Vue.SVGAttributes;
        fePointLight: Vue.SVGAttributes;
        feSpecularLighting: Vue.SVGAttributes;
        feSpotLight: Vue.SVGAttributes;
        feTile: Vue.SVGAttributes;
        feTurbulence: Vue.SVGAttributes;
        filter: Vue.SVGAttributes;
        foreignObject: Vue.SVGAttributes;
        g: Vue.SVGAttributes;
        image: Vue.SVGAttributes;
        line: Vue.SVGAttributes;
        linearGradient: Vue.SVGAttributes;
        marker: Vue.SVGAttributes;
        mask: Vue.SVGAttributes;
        metadata: Vue.SVGAttributes;
        path: Vue.SVGAttributes;
        pattern: Vue.SVGAttributes;
        polygon: Vue.SVGAttributes;
        polyline: Vue.SVGAttributes;
        radialGradient: Vue.SVGAttributes;
        rect: Vue.SVGAttributes;
        stop: Vue.SVGAttributes;
        switch: Vue.SVGAttributes;
        symbol: Vue.SVGAttributes;
        text: Vue.SVGAttributes;
        textPath: Vue.SVGAttributes;
        tspan: Vue.SVGAttributes;
        use: Vue.SVGAttributes;
        view: Vue.SVGAttributes;
    }
}
