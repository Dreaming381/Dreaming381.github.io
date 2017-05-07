function FlattenPoints(vecarray)
{
    
    var i;
    var results = [];
    for (i in vecarray)
    {
        if (vecarray[i].x !== undefined)
        {
            results.push(vecarray[i].x);
        }
        if (vecarray[i].y !== undefined)
        {
            results.push(vecarray[i].y);
        }
        if (vecarray[i].z !== undefined)
        {
            results.push(vecarray[i].z);
        }
        if (vecarray[i].w !== undefined)
        {
            results.push(vecarray[i].w);
        }
        else
        {
            //alert(" Here");
        }
    }
    return results;
}

function FlattenVec(vec)
{
    var results = [];
    if (vec.x !== undefined)
    {
        results.push(vec.x);
    }
    if (vec.y !== undefined)
    {
        results.push(vec.y);
    }
    if (vec.z !== undefined)
    {
        results.push(vec.z);
    }
    if (vec.w !== undefined)
    {
        results.push(vec.w);
    }
    
    return results;
}

function radians(degrees)
{
    return degrees * Math.PI / 180.0;
}

function Vec2(xval, yval)
{
    var result =
        {
            x: xval,
            y: yval
        };
    return result;
}

function Vec3(xval, yval, zval)
{
    var result =
        {
            x: xval,
            y: yval,
            z: zval
        };
    return result;
}

function Vec4(xval, yval, zval, wval)
{
    var result =
        {
            x: xval,
            y: yval,
            z: zval,
            w: wval
        };
    return result;
}

function addVecs(a, b)
{
    var result = {};
    if (a.w !== undefined)
    {
        if (b.w !== undefined)
        {
            result.w = a.w + b.w;
        }
        else
        {
            result.w = a.w;
        }
    }
    else if (b.w !== undefined)
    {
        result.w = b.w;
    }
    if (a.z !== undefined)
    {
        if (b.z !== undefined)
        {
            result.z = a.z + b.z;
        }
        else
        {
            result.z = a.z;
        }
    }
    else if (b.z !== undefined)
    {
        result.z = b.z;
    }
    if (a.y !== undefined)
    {
        if (b.y !== undefined)
        {
            result.y = a.y + b.y;
        }
        else
        {
            result.y = a.y;
        }
    }
    else if (b.y !== undefined)
    {
        result.y = b.y;
    }
    if (a.x !== undefined)
    {
        if (b.x !== undefined)
        {
            result.x = a.x + b.x;
        }
        else
        {
            result.x = a.x;
        }
    }
    else if (b.x !== undefined)
    {
        result.x = b.x;
    }
    return result;
}

function scaleVec(vec, s)
{
    var result = {};
    if (vec.x !== undefined)
    {
        result.x = vec.x * s;
    }
    if (vec.y !== undefined)
    {
        result.y = vec.y * s;
    }
    if (vec.z !== undefined)
    {
        result.z = vec.z * s;
    }
    if (vec.w !== undefined)
    {
        result.w = vec.w * s;
    }
    return result;
}

function interpVal(a, b, fac)
{
    return a * fac + (1 - fac) * b;
}

function interpVec(a, b, fac)
{

    if (a.w !== undefined && b.w !== undefined)
    {
        return Vec4(interpVal(a.x, b.x, fac), interpVal(a.y, b.y, fac), interpVal(a.z, b.z, fac), interpVal(a.w, b.w, fac));
    }
    else if (a.z !== undefined && b.z !== undefine)
    {
        return Vec4(interpVal(a.x, b.x, fac), interpVal(a.y, b.y, fac), interpVal(a.z, b.z, fac));
    }
    else
    {
        return Vec4(interpVal(a.x, b.x, fac), interpVal(a.y, b.y, fac));
    }
}

function normalizeVec(vec)
{
    var result = {};
    var mag = 0;
    if (vec.x !== undefined)
    {
        mag += vec.x * vec.x;
    }
    if (vec.y !== undefined)
    {
        mag += vec.y * vec.y;
    }
    if (vec.z !== undefined)
    {
        mag += vec.z * vec.z;
    }
    if (vec.w !== undefined)
    {
        mag += vec.w * vec.w;
    }

    mag = Math.sqrt(mag);

    if (vec.x !== undefined)
    {
        result.x = vec.x / mag;
    }
    if (vec.y !== undefined)
    {
        result.y = vec.y / mag;
    }
    if (vec.z !== undefined)
    {
        result.z = vec.z / mag;
    }
    if (vec.w !== undefined)
    {
        result.z = vec.z / mag;
    }
    return result;
}

function dotProduct(a, b) //assume Vec3
{
    //var result = {};
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

function crossProduct(a, b) //assumes Vec3.
{
    var result = {};
    result.x = a.y * b.z - a.z * b.y;
    result.y = a.z * b.x - a.x * b.z;
    result.z = a.x * b.y - a.y * b.x;
    return result;
}

function Mat4(r1, r2, r3, r4)
{
    var result = [];
    result[0] = r1;
    result[1] = r2;
    result[2] = r3;
    result[3] = r4;
    return result;
}

function multMat4xVec4(mat, vec)
{
    var result = {};
    result.x = dotProduct(mat[0], vec);
    result.y = dotProduct(mat[1], vec);
    result.z = dotProduct(mat[2], vec);
    result.w = dotProduct(mat[3], vec);
}

function multMat4xMat4(a, b)
{
    
    var result = [];
    for (var i = 0; i < 4; i++)
    {
        result[i] = scaleVec(b[0], a[i].x);
        result[i] = addVecs(result[i], scaleVec(b[1], a[i].y));
        result[i] = addVecs(result[i], scaleVec(b[2], a[i].z));
        result[i] = addVecs(result[i], scaleVec(b[3], a[i].w));
    }
    return result;
}

function getZRotMat(angle)
{
    var theta = angle * Math.PI / 180;
    var result = Mat4(
        Vec4(Math.cos(theta), -1 * Math.sin(theta), 0, 0),
        Vec4(Math.sin(theta),      Math.cos(theta), 0, 0),
        Vec4(              0,                    0, 1, 0),
        Vec4(              0,                    0, 0, 1)
        );
    return result;
}

function getXRotMat(angle)
{
    var theta = angle * Math.PI / 180;
    var result = Mat4(
        Vec4(1,               0,                    0, 0),
        Vec4(0, Math.cos(theta), -1 * Math.sin(theta), 0),
        Vec4(0, Math.sin(theta),      Math.cos(theta), 0),
        Vec4(0,               0,                    0, 1)
        );
    return result;
}

function getYRotMat(angle)
{
    var theta = angle * Math.PI / 180;
    var result = Mat4(
        Vec4(     Math.cos(theta), 0, Math.sin(theta), 0),
        Vec4(                   0, 1,               0, 0),
        Vec4(-1 * Math.sin(theta), 0, Math.cos(theta), 0),
        Vec4(                   0, 0,               0, 1)
        );
    return result;
}

function lookAt(cameraPos, cameraTarget) //assume camera always looks up for now.
{
    var eye = Vec3(-cameraPos.x, -cameraPos.y, -cameraPos.z);
    var target = Vec3(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    var direction = normalizeVec(addVecs(eye, target));
    
    var straightup = Vec3(0, 1, 0);
    var right = crossProduct(straightup, direction);
    right = normalizeVec(right);
    //alert(FlattenVec(right))
    var up = crossProduct(direction, right);
    up = normalizeVec(up);
    direction = scaleVec(direction, -1);
    /*
    var camrot = Mat4(
        Vec4(right.x, right.y, right.z, 0),
        Vec4(up.x, up.y, up.z, 0),
        Vec4(direction.x, direction.y, direction.z, 0),
        Vec4(0, 0, 0, 1)
        );
    var camtrans = Mat4(
        Vec4(1, 0, 0, -eye.x),
        Vec4(0, 1, 0, -eye.y),
        Vec4(0, 0, 1, -eye.z),
        Vec4(0, 0, 0, 1)
        );
    return multMat4xMat4(camtrans, camrot);
    //return multMat4xMat4(camrot, camtrans);
    */
    /*return Mat4(
        Vec4(right.x, right.y, right.z, -dotProduct(right, eye)),
        Vec4(up.x, up.y, up.z, -dotProduct(up, eye)),
        Vec4(direction.x, direction.y, direction.z, -dotProduct(direction, eye)),
        Vec4(0, 0, 0, 1)
        );*/
    
    return Mat4(
        Vec4(right.x, up.x, direction.x, 0),
        Vec4(right.y, up.y, direction.y, 0),
        Vec4(right.z, up.z, direction.z, 0),
        Vec4(-dotProduct(right, eye), -dotProduct(up, eye), dotProduct(direction, eye), 1)
        );

    /*return Mat4(
        Vec4(right.x, up.x, direction.x, 0),
        Vec4(right.y, up.y, direction.y, 0),
        Vec4(right.z, up.z, direction.z, 0),
        Vec4(dotProduct(right, eye), dotProduct(up, eye), dotProduct(direction, eye), 1)
        );*/
}

//Quaternion WIP
function Quaternion(axis, angled)
{
    var angle = angled * Math.PI / 180;

    var result = {};

    result.w = Math.cos(angle / 2);
    result.x = axis.x * sin(angle / 2);
    result.y = axis.y * sin(angle / 2);
    result.z = axis.z * sin(angle / 2);

    return result;
}

function InvertQuaternion(q)
{
    var result = {};

    result.w = q.w;
    result.x = -q.x;
    result.y = -q.y;
    result.z = -q.z;
    return result;
}

function multQuaternion(a, b)
{
    var result = {};
    result.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
    result.x = a.y * b.z - a.z * b.y + a.w * b.x + a.x * b.w;
    result.y = a.z * b.x - a.x * b.z + a.w * b.y + a.y * b.w;
    result.z = a.x * b.y - a.y * b.x + a.w * b.z + a.z * b.w;

    return result;
}