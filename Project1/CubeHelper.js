function SmallCube(posx, posy, posz, index)
{
    points = [];
    colors = [];

    var cube = {};

    var fa = Vec4(-0.25 + posx, 0.25 + posy, 0.25 + posz, 1);
    var fb = Vec4(0.25 + posx, 0.25 + posy, 0.25 + posz, 1);
    var fc = Vec4(0.25 + posx, -0.25 + posy, 0.25 + posz, 1);
    var fd = Vec4(-0.25 + posx, -0.25 + posy, 0.25 + posz, 1);
    var ba = Vec4(-0.25 + posx, 0.25 + posy, -0.25 + posz, 1);
    var bb = Vec4(0.25 + posx, 0.25 + posy, -0.25 + posz, 1);
    var bc = Vec4(0.25 + posx, -0.25 + posy, -0.25 + posz, 1);
    var bd = Vec4(-0.25 + posx, -0.25 + posy, -0.25 + posz, 1);
    

    var black = Vec4(0, 0, 0, 1);
    var sidecolor = Vec4(0, 1, 0, 1); //green
    insetQuad(fa, fb, fc, fd, 0.9, black, sidecolor); //front
    

    sidecolor = Vec4(1, 1, 1, 1); //white
    insetQuad(fa, ba, bb, fb, 0.9, black, sidecolor); //top

    
    sidecolor = Vec4(1, 1, 0, 1); //yellow
    insetQuad(fd, bd, bc, fc, 0.9, black, sidecolor); //bottom
    

    sidecolor = Vec4(1, 0.647, 0, 1); //orange
    insetQuad(fa, fd, bd, ba, 0.9, black, sidecolor); //left

    
    sidecolor = Vec4(1, 0, 0, 1); //red
    insetQuad(fb, bb, bc, fc, 0.9, black, sidecolor); //right

    
    sidecolor = Vec4(0, 0, 1, 1); //blue
    insetQuad(ba, bb, bc, bd, 0.9, black, sidecolor); //back
    //insetQuad(bd, bc, bb, ba, 0.9, black, sidecolor);
    //alert(FlattenPoints(points));
    

    cube.points = points;
    cube.colors = colors;
    cube.index = index;
    cube.inAnim = false;
    cube.rotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
    //cube.rotation = getYRotMat(90);
    cube.animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));

    cube.rotationID = gl.getUniformLocation(program, "modelr");
    cube.cameraID = gl.getUniformLocation(program, "camera");
    cube.projectionID = gl.getUniformLocation(program, 'projection');
    

    cube.ColorBufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.ColorBufferID);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(FlattenPoints(cube.colors)), gl.STATIC_DRAW);

    cube.VertexBufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.VertexBufferID);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(FlattenPoints(cube.points)), gl.STATIC_DRAW);

    return cube;
}

function RenderCube(cube)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.ColorBufferID);
    cube.vertexColorJS = gl.getAttribLocation(program, "vertexColor");
    gl.vertexAttribPointer(cube.vertexColorJS, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cube.vertexColorJS);

    gl.bindBuffer(gl.ARRAY_BUFFER, cube.VertexBufferID);
    cube.vertexPositionJS = gl.getAttribLocation(program, "vertexPosition");
    gl.vertexAttribPointer(cube.vertexPositionJS, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cube.vertexPositionJS);

    //I have no idea why this multiplication works backwards, unless all the references I looked at for consecutive world space rotations weren't clear.
    gl.uniformMatrix4fv(cube.rotationID, false, FlattenPoints(multMat4xMat4(cube.rotation, cube.animRotation)));
    gl.uniformMatrix4fv(cube.cameraID, false, FlattenPoints(CameraMatrix));
    gl.uniformMatrix4fv(cube.projectionID, false, FlattenPoints(ProjMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, cube.points.length);
    //alert("Cube")
}