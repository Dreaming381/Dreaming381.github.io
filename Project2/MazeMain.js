var gl;
var canvas;
var program;
var points = [];
var normals = [];

//Map
var CollisionMap = [];
var MapSize = 180 + 3; //one based plus zero and +1 for collision margins and +1 for two ends
var WallMargin = 1.0;

//Cursor properties
var FPSactive = false;
var xSpeed = 0.005;
var ySpeed = 0.005;

//Keyboard properties
var wKey = false;
var aKey = false;
var sKey = false;
var dKey = false;

//Camera properties
var TargetDirection = {};
var CameraPosition = {};
var CameraMatrix = {};
var ProjMatrix = {};
var MoveSpeed = 10/60;

//Program uniforms
var cameraID;
var projectionID;
var cameraPosID;
var cameraDirID;

//Program Textures
var FloorAlbedoTexture;
var FloorAlbedoImage;
var FloorNormalTexture;
var FloorNormalImage;
var FloorSmoothnessTexture;
var FloorSmoothnessImage;
var WallAlbedoTexture;
var WallAlbedoImage;
var WallNormalTexture;
var WallNormalImage;
var WallSmoothnessTexture;
var WallSmoothnessImage;
var FloorAlbedoID;
var FloorNormalID;
var FloorSmoothnessID;
var WallAlbedoID;
var WallNormalID;
var WallSmoothnessID;

var loadedTextureCount = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    //gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.clearColor(0.001, 0.001, 0.001, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);
    //gl.disable(gl.CullFace);
    
    //  Load shaders and initialize attribute buffers
    
    programMaze = initShaders( gl, "vertex-shader", "fragment-shader" );
    //programSky = initShaders( gl );
    gl.useProgram(programMaze);

    //Initialize Texture Loading
    initTextures();
    
    //Load geometry
    CollisionMap = new Array(MapSize);
    for (var i = 0; i < MapSize; i++)
    {
        CollisionMap[i] = new Array(MapSize);
    }

    for (var i = 0; i < MapSize; i++)
    {
        for (var j = 0; j < MapSize; j++)
        {
            CollisionMap[i][j] = 0;
        }
    }


    //floor
    
    quad(
        Vec4(-10, 0, -10, 1),
        Vec4(MapSize + 10, 0, -10, 1),
        Vec4(MapSize + 10, 0, MapSize + 10, 1),
        Vec4(-10, 0, MapSize + 10, 1)
        );

    //Maze Walls
    BuildMaze();

    //Debug
    /*quad(
        Vec4(-5, -3, 5, 1),
        Vec4(5, -3, 5, 1),
        Vec4(5, 5, 5, 1),
        Vec4(-5, 5, 5, 1)
        );*/
    
    
    //Event listener registrations
    canvas.addEventListener("mousedown", EventMouseDown);
    canvas.addEventListener("mousemove", EventMouseMove);
    //canvas.addEventListener("onkeydown", EventKeyDown);
    //canvas.addEventListener("onkeyup", EventKeyUp);
    document.onkeydown = EventKeyDown;
    document.onkeyup = EventKeyUp;
    


    //Load GPU data
    var normalID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalID);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(FlattenPoints(normals)), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vertexNormalJSMaze = gl.getAttribLocation(programMaze, "vertexNormal");
    gl.vertexAttribPointer(vertexNormalJSMaze, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormalJSMaze);

    //Repeat
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(FlattenPoints(points)), gl.STATIC_DRAW );
    
    var vertexPositionJSMaze = gl.getAttribLocation( programMaze, "vertexPosition" );
    gl.vertexAttribPointer( vertexPositionJSMaze, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vertexPositionJSMaze);

    //Associate shader variables with uniform data

    cameraID = gl.getUniformLocation(programMaze, "camera");
    projectionID = gl.getUniformLocation(programMaze, 'projection');
    cameraPosID = gl.getUniformLocation(programMaze, 'cameraPos');
    cameraDirID = gl.getUniformLocation(programMaze, 'cameraDir');

    //Texture data
    FloorAlbedoID = gl.getUniformLocation(programMaze, "FloorAlbedoSampler");
    FloorNormalID = gl.getUniformLocation(programMaze, "FloorNormalSampler");
    FloorSmoothnessID = gl.getUniformLocation(programMaze, "FloorSmoothnessSampler");
    WallAlbedoID = gl.getUniformLocation(programMaze, "WallAlbedoSampler");
    WallNormalID = gl.getUniformLocation(programMaze, "WallNormalSampler");
    WallSmoothnessID = gl.getUniformLocation(programMaze, "WallSmoothnessSampler");

    /*
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, FloorAlbedoTexture);
    gl.uniform1i(FloorAlbedoID, gl.TEXTURE0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, FloorNormalTexture);
    gl.uniform1i(FloorNormalID, gl.TEXTURE1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, FloorSmoothnessTexture);
    gl.uniform1i(FloorSmoothnessID, gl.TEXTURE2);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, WallAlbedoTexture);
    gl.uniform1i(WallAlbedoID, gl.TEXTURE3);

    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, WallNormalTexture);
    gl.uniform1i(WallNormalID, gl.TEXTURE4);

    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, WallSmoothnessTexture);
    gl.uniform1i(WallSmoothnessID, gl.TEXTURE5);
    */
    //camera init
    CameraPosition = Vec3(5, 1.6, -1);
    TargetDirection = Vec3(0, 0, 1);




    render();

};


function render()
{
    //Update position and look target
    var movx = 0;
    var movz = 0;
    if (wKey == true)
    {
        movz += MoveSpeed;
    }
    if (aKey == true)
    {
        movx -= MoveSpeed;
    }
    if (sKey == true)
    {
        movz -= MoveSpeed;
    }
    if (dKey == true)
    {
        movx += MoveSpeed;
    }

    //Get Camera coords
    var straightup = Vec3(0, 1, 0);
    var right = crossProduct(straightup, TargetDirection);
    right = normalizeVec(right);
    var up = crossProduct(TargetDirection, right);
    up = normalizeVec(up);

    var mforward = normalizeVec(TargetDirection);
    mforward.y = 0;
    mforward = normalizeVec(mforward);
    var mright = normalizeVec(right);
    mright.y = 0;
    mright = normalizeVec(right);

    CameraPosition = addVecs(CameraPosition, scaleVec(mforward, movz));
    CameraPosition = addVecs(CameraPosition, scaleVec(mright, movx));

    //Check Collision
    var ghost = false;
    if (CameraPosition.x > 0 && CameraPosition.x < MapSize && CameraPosition.z > 0 && CameraPosition.z < MapSize && !ghost) //This may seem like all the same code, but the signs in the arithmetic flip. Copy paste fast FTW.
    {
        var TilePosition = Vec2(Math.round(CameraPosition.x), Math.round(CameraPosition.z))
        var CollideTile = CollisionMap[TilePosition.x][TilePosition.y];
        if (CollideTile == 1) //0 degrees of wall
        {
            var edge = TilePosition.x - 0.5 + WallMargin;
            if (CameraPosition.x < edge)
                CameraPosition.x = edge;
        }
        else if (CollideTile == 2) //45 degrees of wall
        {
            var edge = TilePosition.x - 0.5 + WallMargin;
            var edge2 = TilePosition.y - 0.5 + WallMargin;
            if (CameraPosition.x < edge && CameraPosition.z < edge2)
            {
                CameraPosition.x = edge;
                CameraPosition.z = edge2;
            }
        }
        else if (CollideTile == 3) //90 degrees of wall
        {
            var edge = TilePosition.y - 0.5 + WallMargin;
            if (CameraPosition.z < edge)
                CameraPosition.z = edge;
        }
        else if (CollideTile == 4) //135 degrees of wall
        {
            var edge = TilePosition.x + 0.5 - WallMargin;
            var edge2 = TilePosition.y - 0.5 + WallMargin;
            if (CameraPosition.x > edge && CameraPosition.z < edge2)
            {
                CameraPosition.x = edge;
                CameraPosition.z = edge2;
            }
        }
        else if (CollideTile == 5) //180 degrees of wall
        {
            var edge = TilePosition.x + 0.5 - WallMargin;
            if (CameraPosition.x > edge)
                CameraPosition.x = edge;
        }
        else if (CollideTile == 6) //225 degrees of wall
        {
            var edge = TilePosition.x + 0.5 - WallMargin;
            var edge2 = TilePosition.y + 0.5 - WallMargin;
            if (CameraPosition.x > edge && CameraPosition.z > edge2)
            {
                CameraPosition.x = edge;
                CameraPosition.z = edge2;
            }
        }
        else if (CollideTile == 7) //270 degrees of wall
        {
            var edge = TilePosition.y + 0.5 - WallMargin;
            if (CameraPosition.z > edge)
                CameraPosition.z = edge;
        }
        else if (CollideTile == 8) //315 degrees of wall
        {
            var edge = TilePosition.x - 0.5 + WallMargin;
            var edge2 = TilePosition.y + 0.5 - WallMargin;
            if (CameraPosition.x < edge && CameraPosition.z > edge2)
            {
                CameraPosition.x = edge;
                CameraPosition.z = edge2;
            }                
        }
        //Case of 0 is that we don't adjust anything.
        //Case of -1 means we are inside the wall and shouldn't adjust anything so that the player can move out when they try.
    }

    //var numVertices = points.length / 4;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    //alert(FlattenVec(CameraPosition))
    var target = addVecs(CameraPosition, TargetDirection);
    var CameraView = lookAt(CameraPosition, target);
    
    var far = 100;
    var near = 0.03;
    /*var Perspective = Mat4(
        Vec4(0.5, 0, 0, 0),
        Vec4(0, 0.5, 0, 0),
        Vec4(0, 0, (far + 0.1)/(far - 0.1), -2 * far * -0.1 / (far - 0.1)),
        Vec4(0, 0, -1, 0)
        );*/
    var f = 1.0 / Math.tan( radians(60) / 2 );
	var f2 = f * 9.0 / 16.0;
    /*var Perspective = Mat4(
        Vec4(f, 0, 0, 0),
        Vec4(0, f, 0, 0),
        Vec4(0, 0, -(near + far) / (far - near), -2 * near * far / (far - near)),
        Vec4(0, 0, -1, 0)
        );*/

    //I have absolutely no clue why the x component got inverted in perspective, but this took way too long to figure out this and my translations got flipped somewhere.
    var Perspective = Mat4(
        Vec4(f2, 0, 0, 0),
        Vec4(0, f, 0, 0),
        Vec4(0, 0, (near + far) / (near - far), -1),
        Vec4(0, 0, 2 * near * far / (near - far), 0)
        );
    

    CameraMatrix = CameraView;
    //alert(FlattenPoints(CameraMatrix))
    //CameraMatrix = Perspective;
    //CameraMatrix = multMat4xMat4(Perspective, CameraView); allows viewing of warped model which is cool.
    //CameraMatrix = multMat4xMat4(CameraView, Perspective);
    //alert("Here");
    ProjMatrix = Perspective;
    //alert(FlattenPoints(CameraMatrix))

    gl.uniformMatrix4fv(cameraID, false, FlattenPoints(CameraMatrix));

    gl.uniformMatrix4fv(projectionID, false, FlattenPoints(ProjMatrix));

    gl.uniform3fv(cameraPosID, FlattenVec(CameraPosition));
    
    gl.uniform3fv(cameraDirID, FlattenVec(TargetDirection));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, FloorAlbedoTexture);
    //gl.uniform1i(FloorAlbedoID, gl.TEXTURE0);
    gl.uniform1i(FloorAlbedoID, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, FloorNormalTexture);
    gl.uniform1i(FloorNormalID, 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, FloorSmoothnessTexture);
    gl.uniform1i(FloorSmoothnessID, 2);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, WallAlbedoTexture);
    gl.uniform1i(WallAlbedoID, 3);

    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, WallNormalTexture);
    gl.uniform1i(WallNormalID, 4);

    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, WallSmoothnessTexture);
    gl.uniform1i(WallSmoothnessID, 5);

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    requestAnimFrame(render);
}


//Callbacks
function EventMouseDown(event)
{
    if (FPSactive == false)
    {
        FPSactive = true;
        canvas.requestPointerLock();
    }
    else
    {
        FPSactive = false;
        document.exitPointerLock();
    }
}


function EventMouseMove(event)
{
    
    if (FPSactive == true)
    {
        //Use same technique as Rubik's cube except move the lookat target
        
        var movx = event.movementX * xSpeed;
        var movy = event.movementY * -ySpeed;

        //Get Camera coords
        var straightup = Vec3(0, 1, 0);
        var right = crossProduct(straightup, TargetDirection);
        right = normalizeVec(right);
        var up = crossProduct(TargetDirection, right);
        up = normalizeVec(up);

        //Displace Target
        var MoveX = scaleVec(right, movx);
        var MoveY = scaleVec(up, movy);
        TargetDirection = addVecs(TargetDirection, MoveX);
        TargetDirection = addVecs(TargetDirection, MoveY);
        //Normalize Target
        TargetDirection = normalizeVec(TargetDirection);
    }
}

function EventKeyDown(event) 
{ 
    var key = String.fromCharCode(event.keyCode); //This apparently capitalizes?
    //alert(key);
    switch (key)
    {
        case 'W':
            wKey = true;
            break;
        case 'A':
            aKey = true;
            break;
        case 'S':
            sKey = true;
            break;
        case 'D':
            dKey = true;
            break;
    }
}

function EventKeyUp(event)
{
    var key = String.fromCharCode(event.keyCode);
    switch (key)
    {
        case 'W':
            wKey = false;
            break; 
        case 'A':  
            aKey = false;
            break; 
        case 'S':  
            sKey = false;
            break; 
        case 'D':  
            dKey = false;
            break;
    }
}