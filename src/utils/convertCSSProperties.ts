function convertCSSProperties(style: CSSStyleDeclaration) {
    const cssProperties: any = {};
    for (let i = 0; i < style.length; i++) {
        const propertyName = style[i];
        cssProperties[propertyName] = style.getPropertyValue(propertyName);
    }
    return cssProperties;
}

export default convertCSSProperties;
