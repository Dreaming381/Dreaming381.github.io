function triangle(a, b, c, color)
{
    points.push(a, b, c);
    colors.push(color, color, color);
}

function quad(a, b, c, d, color)
{
    triangle(a, b, c, color);
    triangle(a, c, d, color);
}

function insetQuad(a, b, c, d, insetVal, outercolor, innercolor)
{
    var e = interpVec(a, c, insetVal);
    var f = interpVec(b, d, insetVal);
    var g = interpVec(a, c, 1 - insetVal);
    var h = interpVec(b, d, 1 - insetVal);
    quad(a, b, f, e, outercolor);
    quad(b, c, g, f, outercolor);
    quad(c, d, h, g, outercolor);
    quad(d, a, e, h, outercolor);
    quad(e, f, g, h, innercolor);
}