function triangle(a, b, c)
{
    a.w = 1;
    b.w = 1;
    c.w = 1;
    points.push(a, c, b);
    var ab = Vec3(b.x - a.x, b.y - a.y, b.z - a.z);
    var ac = Vec3(c.x - a.x, c.y - a.y, c.z - a.z);
    var normal = normalizeVec(crossProduct(ab, ac));
    normals.push(normal, normal, normal);
}

function quad(a, b, c, d)
{
    triangle(a, b, c);
    triangle(a, c, d);
}

function blendTiles(nTile, oTile)
{
    
    if (oTile == 0)
        return nTile;
    if (oTile == -1)
        return oTile;

    if (oTile == 1)
    {
        if (nTile == 1 || nTile == 8 || nTile == 2)
            return nTile;
        if (nTile == 4 || nTile == 5 || nTile == 6)
            return -1;
        if (nTile == 3)
            return 2;
        if (nTile == 7)
            return 8;
    }
    else if (oTile == 2)
    {
        if (nTile == 1 || nTile == 2 || nTile == 3)
            return oTile;
        else return -1;
    }
    else if (oTile == 3)
    {
        if (nTile == 2 || nTile == 3 || nTile == 4)
            return nTile;
        if (nTile == 6 || nTile == 7 || nTile == 8)
            return -1;
        if (nTile == 1)
            return 2;
        if (nTile == 5)
            return 4;
    }
    else if (oTile == 4)
    {
        if (nTile == 3 || nTile == 4 || nTile == 5)
            return oTile;
        else return -1;
    }
    else if (oTile == 5)
    {
        if (nTile == 4 || nTile == 5 || nTile == 6)
            return nTile;
        if (nTile == 8 || nTile == 1 || nTile == 2)
            return -1;
        if (nTile == 3)
            return 4;
        if (nTile == 7)
            return 6;
    }
    else if (oTile == 6)
    {
        if (nTile == 5 || nTile == 6 || nTile == 7)
            return oTile;
        else return -1;
    }
    else if (oTile == 7)
    {
        if (nTile == 6 || nTile == 7 || nTile == 8)
            return nTile;
        if (nTile == 2 || nTile == 3 || nTile == 4)
            return -1;
        if (nTile == 1)
            return 8;
        if (nTile == 5)
            return 6;
    }
    else if (oTile == 8)
    {
        if (nTile == 7 || nTile == 8 || nTile == 1)
            return oTile;
        else return -1;
    }
    else return -1;
}

function wall(a, b)
{
    var dir = Vec3(b.x - a.x, b.y - a.y, b.z - a.z);
    var dir = normalizeVec(dir);
    var up = Vec3(0, 1, 0);

    var l = Math.max(Math.abs(a.x - b.x), Math.abs(a.z - b.z));
    
    var right = crossProduct(dir, up);
    var f1 = addVecs(scaleVec(dir, -0.5), scaleVec(right, 0.5));
    var f2 = addVecs(scaleVec(dir, -0.5), scaleVec(right, -0.5));
    var f3 = addVecs(scaleVec(dir, l + 0.5), scaleVec(right, 0.5));
    var f4 = addVecs(scaleVec(dir, l + 0.5), scaleVec(right, -0.5));
    f1 = addVecs(a, f1);
    f2 = addVecs(a, f2);
    f3 = addVecs(a, f3);
    f4 = addVecs(a, f4);
    var height = Vec3(0, 5, 0);
    var f5 = addVecs(f1, height);
    var f6 = addVecs(f2, height);
    var f7 = addVecs(f3, height);
    var f8 = addVecs(f4, height);

    
    quad(f1, f5, f6, f2);
    quad(f1, f3, f7, f5);
    quad(f3, f4, f8, f7);
    quad(f4, f2, f6, f8);
    quad(f5, f7, f8, f6);
    
    
    //Going to assume a and b are integer values and walls are axis aligned.
    if (a.x == b.x)
    {
        //sweep bottom
        var mi = Math.min(a.z, b.z);
        var ma = Math.max(a.z, b.z);
        CollisionMap[a.x - 1][mi - 1] = blendTiles(6, CollisionMap[a.x - 1][mi - 1]);
        CollisionMap[a.x - 0][mi - 1] = blendTiles(7, CollisionMap[a.x - 0][mi - 1]);
        CollisionMap[a.x + 1][mi - 1] = blendTiles(8, CollisionMap[a.x + 1][mi - 1]);

        //sweep top
        CollisionMap[a.x - 1][ma + 1] = blendTiles(4, CollisionMap[a.x - 1][ma + 1]);
        CollisionMap[a.x - 0][ma + 1] = blendTiles(3, CollisionMap[a.x - 0][ma + 1]);
        CollisionMap[a.x + 1][ma + 1] = blendTiles(2, CollisionMap[a.x + 1][ma + 1]);
    }
    else
    {
        var mi = Math.min(a.z, b.z);
        var ma = Math.max(a.z, b.z);
        
        for (var i = Math.min(a.x, b.x) ; i <= Math.max(a.x, b.x) ; i++)
        {
            //alert("Here");
            CollisionMap[i][mi - 1] = blendTiles(7, CollisionMap[i][mi - 1]);
            CollisionMap[i][mi + 1] = blendTiles(3, CollisionMap[i][mi + 1]);
            CollisionMap[i][mi + 0] = -1;
        }
        
    }

    if (a.z == b.z)
    {
        //sweep left
        var mi = Math.min(a.x, b.x);
        var ma = Math.max(a.x, b.x);
        CollisionMap[mi - 1][a.z - 1] = blendTiles(6, CollisionMap[mi - 1][a.z - 1]);
        CollisionMap[mi - 1][a.z - 0] = blendTiles(5, CollisionMap[mi - 1][a.z - 0]);
        CollisionMap[mi - 1][a.z + 1] = blendTiles(4, CollisionMap[mi - 1][a.z + 1]);

        //sweep right
        CollisionMap[ma + 1][a.z - 1] = blendTiles(8, CollisionMap[ma + 1][a.z - 1]);
        CollisionMap[ma + 1][a.z - 0] = blendTiles(1, CollisionMap[ma + 1][a.z - 0]);
        CollisionMap[ma + 1][a.z + 1] = blendTiles(2, CollisionMap[ma + 1][a.z + 1]);
    }
    else
    {
        var mi = Math.min(a.x, b.x);
        var ma = Math.max(a.x, b.x);
        for (var i = Math.min(a.z, b.z) ; i <= Math.max(a.z, b.z) ; i++)
        {
            CollisionMap[mi - 1][i] = blendTiles(5, CollisionMap[mi - 1][i]);
            CollisionMap[mi + 1][i] = blendTiles(1, CollisionMap[mi + 1][i]);
            CollisionMap[mi + 0][i] = -1;
        }
    }
    
}

function BuildMaze()
{
    
    //Horizontals
    wall(Vec3(11, 0, 1), Vec3(181, 0, 1));
    wall(Vec3(11, 0, 1), Vec3(21, 0, 1));
    wall(Vec3(31, 0, 1), Vec3(61, 0, 1));
    wall(Vec3(81, 0, 1), Vec3(131, 0, 1));
    wall(Vec3(141, 0, 1), Vec3(161, 0, 1));

    //wall(Vec3(1, 0, 11), Vec3(1, 0, 11));
    wall(Vec3(11, 0, 11), Vec3(21, 0, 11));
    wall(Vec3(31, 0, 11), Vec3(61, 0, 11));
    wall(Vec3(81, 0, 11), Vec3(131, 0, 11));
    wall(Vec3(141, 0, 11), Vec3(161, 0, 11));

    //wall(Vec3(1, 0, 21), Vec3(1, 0, 21));
    wall(Vec3(1, 0, 21), Vec3(11, 0, 21));
    wall(Vec3(21, 0, 21), Vec3(31, 0, 21));
    wall(Vec3(41, 0, 21), Vec3(51, 0, 21));
    wall(Vec3(61, 0, 21), Vec3(71, 0, 21));
    wall(Vec3(101, 0, 21), Vec3(111, 0, 21));
    wall(Vec3(161, 0, 21), Vec3(171, 0, 21));

    //wall(Vec3(1, 0, 31), Vec3(1, 0, 31));
    wall(Vec3(31, 0, 31), Vec3(61, 0, 31));
    wall(Vec3(71, 0, 31), Vec3(101, 0, 31));
    wall(Vec3(121, 0, 31), Vec3(141, 0, 31));
    wall(Vec3(151, 0, 31), Vec3(161, 0, 31));
    wall(Vec3(171, 0, 31), Vec3(181, 0, 31));

    //wall(Vec3(1, 0, 41), Vec3(1, 0, 41));
    wall(Vec3(71, 0, 41), Vec3(91, 0, 41));
    wall(Vec3(101, 0, 41), Vec3(121, 0, 41));
    wall(Vec3(131, 0, 41), Vec3(151, 0, 41));
    wall(Vec3(161, 0, 41), Vec3(171, 0, 41));

    //wall(Vec3(1, 0, 51), Vec3(1, 0, 51));
    wall(Vec3(71, 0, 51), Vec3(81, 0, 51));
    wall(Vec3(91, 0, 51), Vec3(121, 0, 51));
    wall(Vec3(131, 0, 51), Vec3(161, 0, 51));
    wall(Vec3(171, 0, 51), Vec3(181, 0, 51));

    //wall(Vec3(1, 0, 61), Vec3(1, 0, 61));
    wall(Vec3(11, 0, 61), Vec3(41, 0, 61));
    wall(Vec3(71, 0, 61), Vec3(91, 0, 61));
    wall(Vec3(111, 0, 61), Vec3(121, 0, 61));
    wall(Vec3(131, 0, 61), Vec3(141, 0, 61));

    //wall(Vec3(1, 0, 71), Vec3(1, 0, 71));
    wall(Vec3(11, 0, 71), Vec3(21, 0, 71));
    wall(Vec3(31, 0, 71), Vec3(51, 0, 71));
    wall(Vec3(71, 0, 71), Vec3(101, 0, 71));
    wall(Vec3(111, 0, 71), Vec3(131, 0, 71));
    wall(Vec3(141, 0, 71), Vec3(161, 0, 71));

    //wall(Vec3(1, 0, 81), Vec3(1, 0, 81));
    wall(Vec3(31, 0, 81), Vec3(61, 0, 81));
    wall(Vec3(71, 0, 81), Vec3(111, 0, 81));
    wall(Vec3(151, 0, 81), Vec3(171, 0, 81));

    //wall(Vec3(1, 0, 91), Vec3(1, 0, 91));
    wall(Vec3(11, 0, 91), Vec3(21, 0, 91));
    wall(Vec3(31, 0, 91), Vec3(41, 0, 91));
    wall(Vec3(51, 0, 91), Vec3(71, 0, 91));
    wall(Vec3(81, 0, 91), Vec3(91, 0, 91));
    wall(Vec3(141, 0, 91), Vec3(161, 0, 91));

    //wall(Vec3(1, 0, 101), Vec3(1, 0, 101));
    wall(Vec3(11, 0, 101), Vec3(51, 0, 101));
    wall(Vec3(71, 0, 101), Vec3(81, 0, 101));
    wall(Vec3(91, 0, 101), Vec3(101, 0, 101));
    wall(Vec3(121, 0, 101), Vec3(131, 0, 101));
    wall(Vec3(141, 0, 101), Vec3(151, 0, 101));
    wall(Vec3(171, 0, 101), Vec3(181, 0, 101));

    //wall(Vec3(1, 0, 111), Vec3(1, 0, 111));
    wall(Vec3(11, 0, 111), Vec3(21, 0, 111));
    wall(Vec3(41, 0, 111), Vec3(61, 0, 111));
    wall(Vec3(81, 0, 111), Vec3(121, 0, 111));
    wall(Vec3(151, 0, 111), Vec3(161, 0, 111));

    //wall(Vec3(1, 0, 121), Vec3(1, 0, 121));
    wall(Vec3(1, 0, 121), Vec3(21, 0, 121));
    wall(Vec3(41, 0, 121), Vec3(51, 0, 121));
    wall(Vec3(91, 0, 121), Vec3(101, 0, 121));
    wall(Vec3(131, 0, 121), Vec3(141, 0, 121));
    wall(Vec3(161, 0, 121), Vec3(171, 0, 121));

    //wall(Vec3(1, 0, 131), Vec3(1, 0, 131));
    wall(Vec3(11, 0, 131), Vec3(21, 0, 131));
    wall(Vec3(61, 0, 131), Vec3(71, 0, 131));
    wall(Vec3(81, 0, 131), Vec3(91, 0, 131));
    wall(Vec3(101, 0, 131), Vec3(131, 0, 131));
    wall(Vec3(141, 0, 131), Vec3(171, 0, 131));

    //wall(Vec3(1, 0, 141), Vec3(1, 0, 141));
    wall(Vec3(11, 0, 141), Vec3(31, 0, 141));
    wall(Vec3(41, 0, 141), Vec3(71, 0, 141));
    wall(Vec3(81, 0, 141), Vec3(91, 0, 141));
    wall(Vec3(101, 0, 141), Vec3(131, 0, 141));
    wall(Vec3(161, 0, 141), Vec3(181, 0, 141));

    //wall(Vec3(1, 0, 151), Vec3(1, 0, 151));
    wall(Vec3(1, 0, 151), Vec3(11, 0, 151));
    wall(Vec3(31, 0, 151), Vec3(41, 0, 151));
    wall(Vec3(51, 0, 151), Vec3(81, 0, 151));
    wall(Vec3(101, 0, 151), Vec3(111, 0, 151));
    wall(Vec3(121, 0, 151), Vec3(131, 0, 151));
    wall(Vec3(161, 0, 151), Vec3(181, 0, 151));

    //wall(Vec3(1, 0, 161), Vec3(1, 0, 161));
    wall(Vec3(11, 0, 161), Vec3(21, 0, 161));
    wall(Vec3(31, 0, 161), Vec3(51, 0, 161));
    wall(Vec3(61, 0, 161), Vec3(71, 0, 161));
    wall(Vec3(101, 0, 161), Vec3(111, 0, 161));
    wall(Vec3(161, 0, 161), Vec3(171, 0, 161));

    //wall(Vec3(1, 0, 171), Vec3(1, 0, 171));
    wall(Vec3(21, 0, 171), Vec3(61, 0, 171));
    wall(Vec3(81, 0, 171), Vec3(91, 0, 171));
    wall(Vec3(111, 0, 171), Vec3(121, 0, 171));
    wall(Vec3(131, 0, 171), Vec3(141, 0, 171));
    wall(Vec3(151, 0, 171), Vec3(171, 0, 171));

    //wall(Vec3(1, 0, 181), Vec3(1, 0, 181));
    wall(Vec3(1, 0, 181), Vec3(101, 0, 181));
    wall(Vec3(111, 0, 181), Vec3(181, 0, 181));


    //Verticals
    //wall(Vec3(1, 0, 1), Vec3(1, 0, 1));
    wall(Vec3(1, 0, 1), Vec3(1, 0, 181));

    //wall(Vec3(11, 0, 1), Vec3(11, 0, 1));
    wall(Vec3(11, 0, 21), Vec3(11, 0, 61));
    wall(Vec3(11, 0, 131), Vec3(11, 0, 141));
    wall(Vec3(11, 0, 151), Vec3(11, 0, 161));

    //wall(Vec3(21, 0, 1), Vec3(21, 0, 1));
    wall(Vec3(21, 0, 11), Vec3(21, 0, 51));
    wall(Vec3(21, 0, 81), Vec3(21, 0, 101));
    wall(Vec3(21, 0, 111), Vec3(21, 0, 121));
    wall(Vec3(21, 0, 141), Vec3(21, 0, 161));

    //wall(Vec3(31, 0, 1), Vec3(31, 0, 1));
    wall(Vec3(31, 0, 11), Vec3(31, 0, 21));
    wall(Vec3(31, 0, 31), Vec3(31, 0, 51));
    wall(Vec3(31, 0, 91), Vec3(31, 0, 141));

    //wall(Vec3(41, 0, 1), Vec3(41, 0, 1));
    wall(Vec3(41, 0, 11), Vec3(41, 0, 31));
    wall(Vec3(41, 0, 41), Vec3(41, 0, 61));
    wall(Vec3(41, 0, 71), Vec3(41, 0, 81));
    wall(Vec3(41, 0, 111), Vec3(41, 0, 131));
    wall(Vec3(41, 0, 141), Vec3(41, 0, 151));

    //wall(Vec3(51, 0, 1), Vec3(51, 0, 1));
    wall(Vec3(51, 0, 41), Vec3(51, 0, 71));
    wall(Vec3(51, 0, 91), Vec3(51, 0, 111));
    wall(Vec3(51, 0, 131), Vec3(51, 0, 141));
    wall(Vec3(51, 0, 151), Vec3(51, 0, 161));
    wall(Vec3(51, 0, 171), Vec3(51, 0, 181));

    //wall(Vec3(61, 0, 1), Vec3(61, 0, 1));
    wall(Vec3(61, 0, 11), Vec3(61, 0, 21));
    wall(Vec3(61, 0, 31), Vec3(61, 0, 81));
    wall(Vec3(61, 0, 101), Vec3(61, 0, 131));
    wall(Vec3(61, 0, 141), Vec3(61, 0, 151));

    //wall(Vec3(71, 0, 1), Vec3(71, 0, 1));
    wall(Vec3(71, 0, 1), Vec3(71, 0, 21));
    wall(Vec3(71, 0, 81), Vec3(71, 0, 91));
    wall(Vec3(71, 0, 111), Vec3(71, 0, 131));
    wall(Vec3(71, 0, 151), Vec3(71, 0, 161));
    wall(Vec3(71, 0, 171), Vec3(71, 0, 181));

    //wall(Vec3(81, 0, 1), Vec3(81, 0, 1));
    wall(Vec3(81, 0, 11), Vec3(81, 0, 21));
    wall(Vec3(81, 0, 41), Vec3(81, 0, 61));
    wall(Vec3(81, 0, 91), Vec3(81, 0, 101));
    wall(Vec3(81, 0, 111), Vec3(81, 0, 161));
    wall(Vec3(81, 0, 171), Vec3(81, 0, 181));

    //wall(Vec3(91, 0, 1), Vec3(91, 0, 1));
    wall(Vec3(91, 0, 11), Vec3(91, 0, 21));
    wall(Vec3(91, 0, 41), Vec3(91, 0, 51));
    wall(Vec3(91, 0, 61), Vec3(91, 0, 81));
    wall(Vec3(91, 0, 91), Vec3(91, 0, 101));
    wall(Vec3(91, 0, 141), Vec3(91, 0, 161));

    //wall(Vec3(101, 0, 1), Vec3(101, 0, 1));
    wall(Vec3(101, 0, 21), Vec3(101, 0, 31));
    wall(Vec3(101, 0, 61), Vec3(101, 0, 71));
    wall(Vec3(101, 0, 81), Vec3(101, 0, 101));
    wall(Vec3(101, 0, 121), Vec3(101, 0, 131));
    wall(Vec3(101, 0, 141), Vec3(101, 0, 151));
    wall(Vec3(101, 0, 161), Vec3(101, 0, 181));

    //wall(Vec3(111, 0, 1), Vec3(111, 0, 1));
    wall(Vec3(111, 0, 21), Vec3(111, 0, 41));
    wall(Vec3(111, 0, 91), Vec3(111, 0, 111));
    wall(Vec3(111, 0, 121), Vec3(111, 0, 141));
    wall(Vec3(111, 0, 151), Vec3(111, 0, 161));
    wall(Vec3(111, 0, 171), Vec3(111, 0, 181));

    //wall(Vec3(121, 0, 1), Vec3(121, 0, 1));
    wall(Vec3(121, 0, 11), Vec3(121, 0, 31));
    wall(Vec3(121, 0, 41), Vec3(121, 0, 51));
    wall(Vec3(121, 0, 61), Vec3(121, 0, 111));
    wall(Vec3(121, 0, 121), Vec3(121, 0, 131));
    wall(Vec3(121, 0, 151), Vec3(121, 0, 171));

    //wall(Vec3(131, 0, 1), Vec3(131, 0, 1));
    wall(Vec3(131, 0, 11), Vec3(131, 0, 21));
    wall(Vec3(131, 0, 61), Vec3(131, 0, 91));
    wall(Vec3(131, 0, 101), Vec3(131, 0, 111));
    wall(Vec3(131, 0, 121), Vec3(131, 0, 131));
    wall(Vec3(131, 0, 151), Vec3(131, 0, 171));

    //wall(Vec3(141, 0, 1), Vec3(141, 0, 1));
    wall(Vec3(141, 0, 11), Vec3(141, 0, 21));
    wall(Vec3(141, 0, 31), Vec3(141, 0, 41));
    wall(Vec3(141, 0, 51), Vec3(141, 0, 71));
    wall(Vec3(141, 0, 81), Vec3(141, 0, 91));
    wall(Vec3(141, 0, 101), Vec3(141, 0, 151));
    wall(Vec3(141, 0, 161), Vec3(141, 0, 171));

    //wall(Vec3(151, 0, 1), Vec3(151, 0, 1));
    wall(Vec3(151, 0, 21), Vec3(151, 0, 41));
    wall(Vec3(151, 0, 51), Vec3(151, 0, 61));
    wall(Vec3(151, 0, 111), Vec3(151, 0, 151));
    wall(Vec3(151, 0, 161), Vec3(151, 0, 171));

    //wall(Vec3(161, 0, 1), Vec3(161, 0, 1));
    wall(Vec3(161, 0, 1), Vec3(161, 0, 11));
    wall(Vec3(161, 0, 21), Vec3(161, 0, 31));
    wall(Vec3(161, 0, 41), Vec3(161, 0, 51));
    wall(Vec3(161, 0, 61), Vec3(161, 0, 71));
    wall(Vec3(161, 0, 81), Vec3(161, 0, 121));
    wall(Vec3(161, 0, 151), Vec3(161, 0, 161));

    //wall(Vec3(171, 0, 1), Vec3(171, 0, 1));
    wall(Vec3(171, 0, 1), Vec3(171, 0, 11));
    wall(Vec3(171, 0, 21), Vec3(171, 0, 41));
    wall(Vec3(171, 0, 61), Vec3(171, 0, 91));
    wall(Vec3(171, 0, 101), Vec3(171, 0, 111));
    wall(Vec3(171, 0, 161), Vec3(171, 0, 171));

    wall(Vec3(181, 0, 1), Vec3(181, 0, 181));
}

function initTextures()
{

    FloorAlbedoTexture = gl.createTexture();
    FloorAlbedoImage = new Image();
    FloorAlbedoImage.onload = function () { handleTextureLoaded(FloorAlbedoImage, FloorAlbedoTexture); }
    FloorAlbedoImage.src = 'spaced-tiles1-albedo.png';

    FloorNormalTexture = gl.createTexture();
    FloorNormalImage = new Image();
    FloorNormalImage.onload = function () { handleTextureLoaded(FloorNormalImage, FloorNormalTexture); }
    FloorNormalImage.src = 'spaced-tiles1-normal.png';

    FloorSmoothnessTexture = gl.createTexture();
    FloorSmoothnessImage = new Image();
    FloorSmoothnessImage.onload = function () { handleTextureLoadedGray(FloorSmoothnessImage, FloorSmoothnessTexture); }
    FloorSmoothnessImage.src = 'spaced-tiles1-metalsmooth.png';

    WallAlbedoTexture = gl.createTexture();
    WallAlbedoImage = new Image();
    WallAlbedoImage.onload = function () { handleTextureLoaded(WallAlbedoImage, WallAlbedoTexture); }
    WallAlbedoImage.src = 'dungeon-stone1-albedo2.png';

    WallNormalTexture = gl.createTexture();
    WallNormalImage = new Image();
    WallNormalImage.onload = function () { handleTextureLoaded(WallNormalImage, WallNormalTexture); }
    WallNormalImage.src = 'dungeon-stone1-normal.png';

    WallSmoothnessTexture = gl.createTexture();
    WallSmoothnessImage = new Image();
    WallSmoothnessImage.onload = function () { handleTextureLoadedGray(WallSmoothnessImage, WallSmoothnessTexture); }
    WallSmoothnessImage.src = 'dungeon-stone1-metalsmooth.png';
}

function handleTextureLoaded(image, texture)
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    //alert(image);
	
	loadedTextureCount = loadedTextureCount + 1;
	document.getElementById("texCount").innerHTML = loadedTextureCount;
}

function handleTextureLoadedGray(image, texture)
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    //alert("Here");
	
	loadedTextureCount = loadedTextureCount + 1;
	document.getElementById("texCount").innerHTML = loadedTextureCount;
}