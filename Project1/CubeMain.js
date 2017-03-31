var gl;
var canvas;
var program;
var points = [];
var colors = [];
var cubes = [];
var cubelayout = [];

var RotationSpeed = 5; //5 degrees every frame.
var NextMove = undefined; //Means for sequence of moves done by program to not hog resources. Wasn't sure of a cleaner way in JS.
var MoveStack = [];
var Randomizations = 0; //internal counter

//Camera properties
var dragging = false;
var MousePosition = {};
var CameraPosition = {};
var CameraMatrix = {};
var ProjMatrix = {};
var CameraOrbitRadius = 2.5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.2, 0.2, 0.2, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);
    //gl.disable(gl.CullFace);
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    cubes[0] =  SmallCube(-0.50,  0.50,  0.50, 0);
    cubes[1] =  SmallCube(0    ,  0.50,  0.50, 1);
    cubes[2] =  SmallCube(0.50 ,  0.50,  0.50, 2);
    cubes[3] =  SmallCube(-0.50,  0.50,  0   , 3);
    cubes[4] =  SmallCube(0    ,  0.50,  0   , 4);
    cubes[5] =  SmallCube(0.50 ,  0.50,  0   , 5);
    cubes[6] =  SmallCube(-0.50,  0.50, -0.50, 6);
    cubes[7] =  SmallCube(0    ,  0.50, -0.50, 7);
    cubes[8] =  SmallCube(0.50 ,  0.50, -0.50, 8);
    cubes[9] =  SmallCube(-0.50,  0   ,  0.50, 9);
    cubes[10] = SmallCube(0    ,  0   ,  0.50, 10);
    cubes[11] = SmallCube(0.50 ,  0   ,  0.50, 11);
    cubes[12] = SmallCube(-0.50,  0   ,  0   , 12);
    cubes[13] = SmallCube(0    ,  0   ,  0   , 13);
    cubes[14] = SmallCube(0.50 ,  0   ,  0   , 14);
    cubes[15] = SmallCube(-0.50,  0   , -0.50, 15);
    cubes[16] = SmallCube(0    ,  0   , -0.50, 16);
    cubes[17] = SmallCube(0.50 ,  0   , -0.50, 17);
    cubes[18] = SmallCube(-0.50, -0.50,  0.50, 18);
    cubes[19] = SmallCube(0    , -0.50,  0.50, 19);
    cubes[20] = SmallCube(0.50 , -0.50,  0.50, 20);
    cubes[21] = SmallCube(-0.50, -0.50,  0   , 21);
    cubes[22] = SmallCube(0    , -0.50,  0   , 22);
    cubes[23] = SmallCube(0.50 , -0.50,  0   , 23);
    cubes[24] = SmallCube(-0.50, -0.50, -0.50, 24);
    cubes[25] = SmallCube(0    , -0.50, -0.50, 25);
    cubes[26] = SmallCube(0.50, -0.50, -0.50, 26);

    
    //cubelayout[2] = [];
    //cubelayout[2][2] = [];
    cubelayout = new Array(3);
    for (var i = 0; i < 3; i++)
    {
        cubelayout[i] = new Array(3);
    }

    for (var i = 0; i < 3; i++)
    {
        for (var j = 0; j < 3; j++)
        {
            cubelayout[i][j] = new Array(3);
        }
    }

    
    var count = 0;
    for (var i = 0; i < 3; i++)
    {
        for (var j = 0; j < 3; j++)
        {
            for (var k = 0; k < 3; k++)
            {
                //alert([i, j, k]);
                cubelayout[k][i][j] = cubes[count].index;
                count++;
            }
        }
    }

    
    
    
    //Event listener registrations
    document.getElementById("topLeft").onclick = TwistTopLeft;
    document.getElementById("middleLeft").onclick = TwistMiddleLeft;
    document.getElementById("bottomLeft").onclick = TwistBottomLeft;
    document.getElementById("topRight").onclick = TwistTopRight;
    document.getElementById("middleRight").onclick = TwistMiddleRight;
    document.getElementById("bottomRight").onclick = TwistBottomRight;

    document.getElementById("leftUp").onclick = TwistLeftUp;
    document.getElementById("middleUp").onclick = TwistMiddleUp;
    document.getElementById("rightUp").onclick = TwistRightUp;
    document.getElementById("leftDown").onclick = TwistLeftDown;
    document.getElementById("middleDown").onclick = TwistMiddleDown;
    document.getElementById("rightDown").onclick = TwistRightDown;

    document.getElementById("frontLeft").onclick = TwistFrontLeft;
    document.getElementById("centerLeft").onclick = TwistCenterLeft;
    document.getElementById("backLeft").onclick = TwistBackLeft;
    document.getElementById("frontRight").onclick = TwistFrontRight;
    document.getElementById("centerRight").onclick = TwistCenterRight;
    document.getElementById("backRight").onclick = TwistBackRight;
    
    document.getElementById("SolveCube").onclick = SolveStart;
    document.getElementById("Randomize").onclick = StartRandomizeCube;

    document.getElementById("resetView").onclick = ResetView;
    
    canvas.addEventListener("mousedown", EventMouseDown);
    canvas.addEventListener("mouseup", EventMouseUp);
    canvas.addEventListener("mousemove", EventMouseMove);
    


         // Load the color data into the GPU

    //var cBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(FlattenPoints(colors)), gl.STATIC_DRAW);
    
    // Associate our color shader variables with our data buffer

    //var vertexColorJS = gl.getAttribLocation(program, "vertexColor");
    //gl.vertexAttribPointer(vertexColorJS, 4, gl.FLOAT, false, 0, 0);
    //gl.enableVertexAttribArray(vertexColorJS);
    
    //

    //var bufferId = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    //gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(FlattenPoints(points)), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    //var vertexPositionJS = gl.getAttribLocation( program, "vertexPosition" );
    //gl.vertexAttribPointer( vertexPositionJS, 4, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vertexPositionJS );
    

    //camera init
    //CameraPosition = Vec3(0, 0, CameraOrbitRadius);
    //CameraPosition = Vec3(CameraOrbitRadius, 0, 0);
    CameraPosition = Vec3(0, 0, CameraOrbitRadius);

    render();
};


function render()
{
    //var numVertices = points.length / 4;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    //alert(FlattenVec(CameraPosition))
    var CameraView = lookAt(CameraPosition, Vec3(0, 0, 0));
    
    var far = CameraOrbitRadius * 5;
    var near = 0.01;
    /*var Perspective = Mat4(
        Vec4(0.5, 0, 0, 0),
        Vec4(0, 0.5, 0, 0),
        Vec4(0, 0, (far + 0.1)/(far - 0.1), -2 * far * -0.1 / (far - 0.1)),
        Vec4(0, 0, -1, 0)
        );*/
    var f = 1.0 / Math.tan( radians(60) / 2 );
    /*var Perspective = Mat4(
        Vec4(f, 0, 0, 0),
        Vec4(0, f, 0, 0),
        Vec4(0, 0, -(near + far) / (far - near), -2 * near * far / (far - near)),
        Vec4(0, 0, -1, 0)
        );*/

    //I have absolutely no clue why the x component got inverted in perspective, but this took way too long to figure out this and my translations got flipped somewhere.
    var Perspective = Mat4(
        Vec4(-f, 0, 0, 0),
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
    for (var i = 0; i < cubes.length; i++)
    {
        RenderCube(cubes[i]);
    }
}


//Callbacks
function EventMouseDown(event)
{
    dragging = true;
    
}

function EventMouseUp(event)
{
    dragging = false;
}

function EventMouseMove(event)
{
    var x = 2*event.clientX/canvas.width-1;
    var y = 2*(canvas.height-event.clientY)/canvas.height-1;

    if (dragging == true)
    {
        //technique: Rotation has weird edge cases that lend themselves to quaternions, which I don't have working.
        //Solution: Move camera along its local x and y, then globally snap to sphere.
        //alert("Here")
        //First, need local x and y vectors in global space.
        var cameraTarget = Vec3(0, 0, 0);
        var eye = Vec3(CameraPosition.x, CameraPosition.y, CameraPosition.z);
        var target = Vec3(-cameraTarget.x, -cameraTarget.y, -cameraTarget.z);
        var direction = normalizeVec(addVecs(CameraPosition, cameraTarget));

        var direction = normalizeVec(addVecs(eye, target));
    
        var straightup = Vec3(0, 1, 0);
        var right = crossProduct(straightup, direction);
        right = normalizeVec(right);
        //alert(FlattenVec(right))
        var up = crossProduct(direction, right);
        up = normalizeVec(up);

        var MoveX = scaleVec(right, -(x - MousePosition.x) * 5);
        var MoveY = scaleVec(up, -(y - MousePosition.y) * 5);
        //alert(FlattenVec(MoveX))
        CameraPosition = addVecs(CameraPosition, MoveX);
        CameraPosition = addVecs(CameraPosition, MoveY);
        
        CameraPosition = normalizeVec(CameraPosition);
        CameraPosition = scaleVec(CameraPosition, CameraOrbitRadius);
        //alert(FlattenVec(CameraPosition))
        render();
    }

    MousePosition.x = x;
    MousePosition.y = y;
}

function ResetView()
{
    CameraPosition = Vec3(0, 0, CameraOrbitRadius);
    render();
}

function TwistTopLeft()
{
    //alert("Here");
    function* ttlroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][0]];
        twistCubes[1] = cubes[cubelayout[1][0][0]];
        twistCubes[2] = cubes[cubelayout[2][0][0]];
        twistCubes[3] = cubes[cubelayout[0][0][1]];
        twistCubes[4] = cubes[cubelayout[1][0][1]];
        twistCubes[5] = cubes[cubelayout[2][0][1]];
        twistCubes[6] = cubes[cubelayout[0][0][2]];
        twistCubes[7] = cubes[cubelayout[1][0][2]];
        twistCubes[8] = cubes[cubelayout[2][0][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getYRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[0][0][2] = twistCubes[0].index;
        cubelayout[0][0][1] = twistCubes[1].index;
        cubelayout[0][0][0] = twistCubes[2].index;
        cubelayout[1][0][2] = twistCubes[3].index;
        cubelayout[1][0][1] = twistCubes[4].index;
        cubelayout[1][0][0] = twistCubes[5].index;
        cubelayout[2][0][2] = twistCubes[6].index;
        cubelayout[2][0][1] = twistCubes[7].index;
        cubelayout[2][0][0] = twistCubes[8].index;

        MoveStack.push("ttl");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = ttlroutine();
    

    function ttlprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(ttlprogress);
        }
    }

    ttlprogress();
}

function TwistMiddleLeft()
{
    //alert("Here");
    function* tmlroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][1][0]];
        twistCubes[1] = cubes[cubelayout[1][1][0]];
        twistCubes[2] = cubes[cubelayout[2][1][0]];
        twistCubes[3] = cubes[cubelayout[0][1][1]];
        twistCubes[4] = cubes[cubelayout[1][1][1]];
        twistCubes[5] = cubes[cubelayout[2][1][1]];
        twistCubes[6] = cubes[cubelayout[0][1][2]];
        twistCubes[7] = cubes[cubelayout[1][1][2]];
        twistCubes[8] = cubes[cubelayout[2][1][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }
        
        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getYRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[0][1][2] = twistCubes[0].index;
        cubelayout[0][1][1] = twistCubes[1].index;
        cubelayout[0][1][0] = twistCubes[2].index;
        cubelayout[1][1][2] = twistCubes[3].index;
        cubelayout[1][1][1] = twistCubes[4].index;
        cubelayout[1][1][0] = twistCubes[5].index;
        cubelayout[2][1][2] = twistCubes[6].index;
        cubelayout[2][1][1] = twistCubes[7].index;
        cubelayout[2][1][0] = twistCubes[8].index;

        MoveStack.push("tml");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tmlroutine();
    

    function tmlprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tmlprogress);
        }
    }

    tmlprogress();
}

function TwistBottomLeft()
{
    //alert("Here");
    function* tblroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][2][0]];
        twistCubes[1] = cubes[cubelayout[1][2][0]];
        twistCubes[2] = cubes[cubelayout[2][2][0]];
        twistCubes[3] = cubes[cubelayout[0][2][1]];
        twistCubes[4] = cubes[cubelayout[1][2][1]];
        twistCubes[5] = cubes[cubelayout[2][2][1]];
        twistCubes[6] = cubes[cubelayout[0][2][2]];
        twistCubes[7] = cubes[cubelayout[1][2][2]];
        twistCubes[8] = cubes[cubelayout[2][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }
        
        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getYRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[0][2][2] = twistCubes[0].index;
        cubelayout[0][2][1] = twistCubes[1].index;
        cubelayout[0][2][0] = twistCubes[2].index;
        cubelayout[1][2][2] = twistCubes[3].index;
        cubelayout[1][2][1] = twistCubes[4].index;
        cubelayout[1][2][0] = twistCubes[5].index;
        cubelayout[2][2][2] = twistCubes[6].index;
        cubelayout[2][2][1] = twistCubes[7].index;
        cubelayout[2][2][0] = twistCubes[8].index;

        MoveStack.push("tbl");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tblroutine();
    

    function tblprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tblprogress);
        }
    }

    tblprogress();
}

function TwistTopRight()
{
    //alert("Here");
    function* ttrroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][0]];
        twistCubes[1] = cubes[cubelayout[1][0][0]];
        twistCubes[2] = cubes[cubelayout[2][0][0]];
        twistCubes[3] = cubes[cubelayout[0][0][1]];
        twistCubes[4] = cubes[cubelayout[1][0][1]];
        twistCubes[5] = cubes[cubelayout[2][0][1]];
        twistCubes[6] = cubes[cubelayout[0][0][2]];
        twistCubes[7] = cubes[cubelayout[1][0][2]];
        twistCubes[8] = cubes[cubelayout[2][0][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getYRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[2][0][0] = twistCubes[0].index;
        cubelayout[2][0][1] = twistCubes[1].index;
        cubelayout[2][0][2] = twistCubes[2].index;
        cubelayout[1][0][0] = twistCubes[3].index;
        cubelayout[1][0][1] = twistCubes[4].index;
        cubelayout[1][0][2] = twistCubes[5].index;
        cubelayout[0][0][0] = twistCubes[6].index;
        cubelayout[0][0][1] = twistCubes[7].index;
        cubelayout[0][0][2] = twistCubes[8].index;

        MoveStack.push("ttr");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = ttrroutine();
    

    function ttrprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(ttrprogress);
        }
    }

    ttrprogress();
}

function TwistMiddleRight()
{
    //alert("Here");
    function* tmrroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][1][0]];
        twistCubes[1] = cubes[cubelayout[1][1][0]];
        twistCubes[2] = cubes[cubelayout[2][1][0]];
        twistCubes[3] = cubes[cubelayout[0][1][1]];
        twistCubes[4] = cubes[cubelayout[1][1][1]];
        twistCubes[5] = cubes[cubelayout[2][1][1]];
        twistCubes[6] = cubes[cubelayout[0][1][2]];
        twistCubes[7] = cubes[cubelayout[1][1][2]];
        twistCubes[8] = cubes[cubelayout[2][1][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getYRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[2][1][0] = twistCubes[0].index;
        cubelayout[2][1][1] = twistCubes[1].index;
        cubelayout[2][1][2] = twistCubes[2].index;
        cubelayout[1][1][0] = twistCubes[3].index;
        cubelayout[1][1][1] = twistCubes[4].index;
        cubelayout[1][1][2] = twistCubes[5].index;
        cubelayout[0][1][0] = twistCubes[6].index;
        cubelayout[0][1][1] = twistCubes[7].index;
        cubelayout[0][1][2] = twistCubes[8].index;

        MoveStack.push("tmr");
        

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tmrroutine();
    

    function tmrprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tmrprogress);
        }
    }

    tmrprogress();
}

function TwistBottomRight()
{
    //alert("Here");
    function* tbrroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][2][0]];
        twistCubes[1] = cubes[cubelayout[1][2][0]];
        twistCubes[2] = cubes[cubelayout[2][2][0]];
        twistCubes[3] = cubes[cubelayout[0][2][1]];
        twistCubes[4] = cubes[cubelayout[1][2][1]];
        twistCubes[5] = cubes[cubelayout[2][2][1]];
        twistCubes[6] = cubes[cubelayout[0][2][2]];
        twistCubes[7] = cubes[cubelayout[1][2][2]];
        twistCubes[8] = cubes[cubelayout[2][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getYRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[2][2][0] = twistCubes[0].index;
        cubelayout[2][2][1] = twistCubes[1].index;
        cubelayout[2][2][2] = twistCubes[2].index;
        cubelayout[1][2][0] = twistCubes[3].index;
        cubelayout[1][2][1] = twistCubes[4].index;
        cubelayout[1][2][2] = twistCubes[5].index;
        cubelayout[0][2][0] = twistCubes[6].index;
        cubelayout[0][2][1] = twistCubes[7].index;
        cubelayout[0][2][2] = twistCubes[8].index;

        MoveStack.push("tbr");
        

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tbrroutine();
    

    function tbrprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tbrprogress);
        }
    }

    tbrprogress();
}

function TwistLeftUp()
{
    //alert("Here");
    function* tluroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][0]];
        twistCubes[1] = cubes[cubelayout[0][0][1]];
        twistCubes[2] = cubes[cubelayout[0][0][2]];
        twistCubes[3] = cubes[cubelayout[0][1][0]];
        twistCubes[4] = cubes[cubelayout[0][1][1]];
        twistCubes[5] = cubes[cubelayout[0][1][2]];
        twistCubes[6] = cubes[cubelayout[0][2][0]];
        twistCubes[7] = cubes[cubelayout[0][2][1]];
        twistCubes[8] = cubes[cubelayout[0][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getXRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[0][0][2] = twistCubes[0].index;
        cubelayout[0][1][2] = twistCubes[1].index;
        cubelayout[0][2][2] = twistCubes[2].index;
        cubelayout[0][0][1] = twistCubes[3].index;
        cubelayout[0][1][1] = twistCubes[4].index;
        cubelayout[0][2][1] = twistCubes[5].index;
        cubelayout[0][0][0] = twistCubes[6].index;
        cubelayout[0][1][0] = twistCubes[7].index;
        cubelayout[0][2][0] = twistCubes[8].index;

        MoveStack.push("tlu");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tluroutine();
    

    function tluprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tluprogress);
        }
    }

    tluprogress();
}

function TwistMiddleUp()
{
    //alert("Here");
    function* tmuroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[1][0][0]];
        twistCubes[1] = cubes[cubelayout[1][0][1]];
        twistCubes[2] = cubes[cubelayout[1][0][2]];
        twistCubes[3] = cubes[cubelayout[1][1][0]];
        twistCubes[4] = cubes[cubelayout[1][1][1]];
        twistCubes[5] = cubes[cubelayout[1][1][2]];
        twistCubes[6] = cubes[cubelayout[1][2][0]];
        twistCubes[7] = cubes[cubelayout[1][2][1]];
        twistCubes[8] = cubes[cubelayout[1][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getXRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[1][0][2] = twistCubes[0].index;
        cubelayout[1][1][2] = twistCubes[1].index;
        cubelayout[1][2][2] = twistCubes[2].index;
        cubelayout[1][0][1] = twistCubes[3].index;
        cubelayout[1][1][1] = twistCubes[4].index;
        cubelayout[1][2][1] = twistCubes[5].index;
        cubelayout[1][0][0] = twistCubes[6].index;
        cubelayout[1][1][0] = twistCubes[7].index;
        cubelayout[1][2][0] = twistCubes[8].index;

        MoveStack.push("tmu");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tmuroutine();
    

    function tmuprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tmuprogress);
        }
    }

    tmuprogress();
}

function TwistRightUp()
{
    //alert("Here");
    function* truroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[2][0][0]];
        twistCubes[1] = cubes[cubelayout[2][0][1]];
        twistCubes[2] = cubes[cubelayout[2][0][2]];
        twistCubes[3] = cubes[cubelayout[2][1][0]];
        twistCubes[4] = cubes[cubelayout[2][1][1]];
        twistCubes[5] = cubes[cubelayout[2][1][2]];
        twistCubes[6] = cubes[cubelayout[2][2][0]];
        twistCubes[7] = cubes[cubelayout[2][2][1]];
        twistCubes[8] = cubes[cubelayout[2][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getXRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[2][0][2] = twistCubes[0].index;
        cubelayout[2][1][2] = twistCubes[1].index;
        cubelayout[2][2][2] = twistCubes[2].index;
        cubelayout[2][0][1] = twistCubes[3].index;
        cubelayout[2][1][1] = twistCubes[4].index;
        cubelayout[2][2][1] = twistCubes[5].index;
        cubelayout[2][0][0] = twistCubes[6].index;
        cubelayout[2][1][0] = twistCubes[7].index;
        cubelayout[2][2][0] = twistCubes[8].index;

        MoveStack.push("tru");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = truroutine();
    

    function truprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(truprogress);
        }
    }

    truprogress();
}

function TwistLeftDown()
{
    //alert("Here");
    function* tldroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][0]];
        twistCubes[1] = cubes[cubelayout[0][0][1]];
        twistCubes[2] = cubes[cubelayout[0][0][2]];
        twistCubes[3] = cubes[cubelayout[0][1][0]];
        twistCubes[4] = cubes[cubelayout[0][1][1]];
        twistCubes[5] = cubes[cubelayout[0][1][2]];
        twistCubes[6] = cubes[cubelayout[0][2][0]];
        twistCubes[7] = cubes[cubelayout[0][2][1]];
        twistCubes[8] = cubes[cubelayout[0][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getXRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[0][2][0] = twistCubes[0].index;
        cubelayout[0][1][0] = twistCubes[1].index;
        cubelayout[0][0][0] = twistCubes[2].index;
        cubelayout[0][2][1] = twistCubes[3].index;
        cubelayout[0][1][1] = twistCubes[4].index;
        cubelayout[0][0][1] = twistCubes[5].index;
        cubelayout[0][2][2] = twistCubes[6].index;
        cubelayout[0][1][2] = twistCubes[7].index;
        cubelayout[0][0][2] = twistCubes[8].index;

        MoveStack.push("tld");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tldroutine();
    

    function tldprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tldprogress);
        }
    }

    tldprogress();
}

function TwistMiddleDown()
{
    //alert("Here");
    function* tmdroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[1][0][0]];
        twistCubes[1] = cubes[cubelayout[1][0][1]];
        twistCubes[2] = cubes[cubelayout[1][0][2]];
        twistCubes[3] = cubes[cubelayout[1][1][0]];
        twistCubes[4] = cubes[cubelayout[1][1][1]];
        twistCubes[5] = cubes[cubelayout[1][1][2]];
        twistCubes[6] = cubes[cubelayout[1][2][0]];
        twistCubes[7] = cubes[cubelayout[1][2][1]];
        twistCubes[8] = cubes[cubelayout[1][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getXRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[1][2][0] = twistCubes[0].index;
        cubelayout[1][1][0] = twistCubes[1].index;
        cubelayout[1][0][0] = twistCubes[2].index;
        cubelayout[1][2][1] = twistCubes[3].index;
        cubelayout[1][1][1] = twistCubes[4].index;
        cubelayout[1][0][1] = twistCubes[5].index;
        cubelayout[1][2][2] = twistCubes[6].index;
        cubelayout[1][1][2] = twistCubes[7].index;
        cubelayout[1][0][2] = twistCubes[8].index;

        MoveStack.push("tmd");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tmdroutine();
    

    function tmdprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tmdprogress);
        }
    }

    tmdprogress();
}

function TwistRightDown()
{
    //alert("Here");
    function* trdroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[2][0][0]];
        twistCubes[1] = cubes[cubelayout[2][0][1]];
        twistCubes[2] = cubes[cubelayout[2][0][2]];
        twistCubes[3] = cubes[cubelayout[2][1][0]];
        twistCubes[4] = cubes[cubelayout[2][1][1]];
        twistCubes[5] = cubes[cubelayout[2][1][2]];
        twistCubes[6] = cubes[cubelayout[2][2][0]];
        twistCubes[7] = cubes[cubelayout[2][2][1]];
        twistCubes[8] = cubes[cubelayout[2][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getXRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[2][2][0] = twistCubes[0].index;
        cubelayout[2][1][0] = twistCubes[1].index;
        cubelayout[2][0][0] = twistCubes[2].index;
        cubelayout[2][2][1] = twistCubes[3].index;
        cubelayout[2][1][1] = twistCubes[4].index;
        cubelayout[2][0][1] = twistCubes[5].index;
        cubelayout[2][2][2] = twistCubes[6].index;
        cubelayout[2][1][2] = twistCubes[7].index;
        cubelayout[2][0][2] = twistCubes[8].index;

        MoveStack.push("trd");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = trdroutine();
    

    function trdprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(trdprogress);
        }
    }

    trdprogress();
}

function TwistFrontLeft()
{
    //alert("Here");
    function* tflroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][0]];
        twistCubes[1] = cubes[cubelayout[1][0][0]];
        twistCubes[2] = cubes[cubelayout[2][0][0]];
        twistCubes[3] = cubes[cubelayout[0][1][0]];
        twistCubes[4] = cubes[cubelayout[1][1][0]];
        twistCubes[5] = cubes[cubelayout[2][1][0]];
        twistCubes[6] = cubes[cubelayout[0][2][0]];
        twistCubes[7] = cubes[cubelayout[1][2][0]];
        twistCubes[8] = cubes[cubelayout[2][2][0]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getZRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[0][2][0] = twistCubes[0].index;
        cubelayout[0][1][0] = twistCubes[1].index;
        cubelayout[0][0][0] = twistCubes[2].index;
        cubelayout[1][2][0] = twistCubes[3].index;
        cubelayout[1][1][0] = twistCubes[4].index;
        cubelayout[1][0][0] = twistCubes[5].index;
        cubelayout[2][2][0] = twistCubes[6].index;
        cubelayout[2][1][0] = twistCubes[7].index;
        cubelayout[2][0][0] = twistCubes[8].index;

        MoveStack.push("tfl");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tflroutine();
    

    function tflprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tflprogress);
        }
    }

    tflprogress();
}

function TwistCenterLeft()
{
    //alert("Here");
    function* tclroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][1]];
        twistCubes[1] = cubes[cubelayout[1][0][1]];
        twistCubes[2] = cubes[cubelayout[2][0][1]];
        twistCubes[3] = cubes[cubelayout[0][1][1]];
        twistCubes[4] = cubes[cubelayout[1][1][1]];
        twistCubes[5] = cubes[cubelayout[2][1][1]];
        twistCubes[6] = cubes[cubelayout[0][2][1]];
        twistCubes[7] = cubes[cubelayout[1][2][1]];
        twistCubes[8] = cubes[cubelayout[2][2][1]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getZRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[0][2][1] = twistCubes[0].index;
        cubelayout[0][1][1] = twistCubes[1].index;
        cubelayout[0][0][1] = twistCubes[2].index;
        cubelayout[1][2][1] = twistCubes[3].index;
        cubelayout[1][1][1] = twistCubes[4].index;
        cubelayout[1][0][1] = twistCubes[5].index;
        cubelayout[2][2][1] = twistCubes[6].index;
        cubelayout[2][1][1] = twistCubes[7].index;
        cubelayout[2][0][1] = twistCubes[8].index;

        MoveStack.push("tcl");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tclroutine();
    

    function tclprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tclprogress);
        }
    }

    tclprogress();
}

function TwistBackLeft()
{
    //alert("Here");
    function* tblroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][2]];
        twistCubes[1] = cubes[cubelayout[1][0][2]];
        twistCubes[2] = cubes[cubelayout[2][0][2]];
        twistCubes[3] = cubes[cubelayout[0][1][2]];
        twistCubes[4] = cubes[cubelayout[1][1][2]];
        twistCubes[5] = cubes[cubelayout[2][1][2]];
        twistCubes[6] = cubes[cubelayout[0][2][2]];
        twistCubes[7] = cubes[cubelayout[1][2][2]];
        twistCubes[8] = cubes[cubelayout[2][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim >= -90; twistAnim -= RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getZRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[0][2][2] = twistCubes[0].index;
        cubelayout[0][1][2] = twistCubes[1].index;
        cubelayout[0][0][2] = twistCubes[2].index;
        cubelayout[1][2][2] = twistCubes[3].index;
        cubelayout[1][1][2] = twistCubes[4].index;
        cubelayout[1][0][2] = twistCubes[5].index;
        cubelayout[2][2][2] = twistCubes[6].index;
        cubelayout[2][1][2] = twistCubes[7].index;
        cubelayout[2][0][2] = twistCubes[8].index;

        MoveStack.push("tbkl");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tblroutine();
    

    function tblprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tblprogress);
        }
    }

    tblprogress();
}

function TwistFrontRight()
{
    //alert("Here");
    function* tfrroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][0]];
        twistCubes[1] = cubes[cubelayout[1][0][0]];
        twistCubes[2] = cubes[cubelayout[2][0][0]];
        twistCubes[3] = cubes[cubelayout[0][1][0]];
        twistCubes[4] = cubes[cubelayout[1][1][0]];
        twistCubes[5] = cubes[cubelayout[2][1][0]];
        twistCubes[6] = cubes[cubelayout[0][2][0]];
        twistCubes[7] = cubes[cubelayout[1][2][0]];
        twistCubes[8] = cubes[cubelayout[2][2][0]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getZRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[2][0][0] = twistCubes[0].index;
        cubelayout[2][1][0] = twistCubes[1].index;
        cubelayout[2][2][0] = twistCubes[2].index;
        cubelayout[1][0][0] = twistCubes[3].index;
        cubelayout[1][1][0] = twistCubes[4].index;
        cubelayout[1][2][0] = twistCubes[5].index;
        cubelayout[0][0][0] = twistCubes[6].index;
        cubelayout[0][1][0] = twistCubes[7].index;
        cubelayout[0][2][0] = twistCubes[8].index;

        MoveStack.push("tfr");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tfrroutine();
    

    function tfrprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tfrprogress);
        }
    }

    tfrprogress();
}

function TwistCenterRight()
{
    //alert("Here");
    function* tcrroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][1]];
        twistCubes[1] = cubes[cubelayout[1][0][1]];
        twistCubes[2] = cubes[cubelayout[2][0][1]];
        twistCubes[3] = cubes[cubelayout[0][1][1]];
        twistCubes[4] = cubes[cubelayout[1][1][1]];
        twistCubes[5] = cubes[cubelayout[2][1][1]];
        twistCubes[6] = cubes[cubelayout[0][2][1]];
        twistCubes[7] = cubes[cubelayout[1][2][1]];
        twistCubes[8] = cubes[cubelayout[2][2][1]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getZRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[2][0][1] = twistCubes[0].index;
        cubelayout[2][1][1] = twistCubes[1].index;
        cubelayout[2][2][1] = twistCubes[2].index;
        cubelayout[1][0][1] = twistCubes[3].index;
        cubelayout[1][1][1] = twistCubes[4].index;
        cubelayout[1][2][1] = twistCubes[5].index;
        cubelayout[0][0][1] = twistCubes[6].index;
        cubelayout[0][1][1] = twistCubes[7].index;
        cubelayout[0][2][1] = twistCubes[8].index;

        MoveStack.push("tcr");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tcrroutine();
    

    function tcrprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tcrprogress);
        }
    }

    tcrprogress();
}

function TwistBackRight()
{
    //alert("Here");
    function* tbrroutine()
    {
        var twistCubes = [];
        twistCubes[0] = cubes[cubelayout[0][0][2]];
        twistCubes[1] = cubes[cubelayout[1][0][2]];
        twistCubes[2] = cubes[cubelayout[2][0][2]];
        twistCubes[3] = cubes[cubelayout[0][1][2]];
        twistCubes[4] = cubes[cubelayout[1][1][2]];
        twistCubes[5] = cubes[cubelayout[2][1][2]];
        twistCubes[6] = cubes[cubelayout[0][2][2]];
        twistCubes[7] = cubes[cubelayout[1][2][2]];
        twistCubes[8] = cubes[cubelayout[2][2][2]];

        for (var i = 0; i < 9; i++)
        {
            if (twistCubes[i].inAnim === true)
            {
                return false;
            }
        }
        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].inAnim = true;
        }

        for (var twistAnim = 0; twistAnim <= 90; twistAnim += RotationSpeed)
        {
            for (var i = 0; i < 9; i++)
            {
                twistCubes[i].animRotation = getZRotMat(twistAnim);
            }
            render();
            //alert(twistAnim);
            yield twistAnim;
        }

        for (var i = 0; i < 9; i++)
        {
            twistCubes[i].rotation = multMat4xMat4(twistCubes[i].rotation, twistCubes[i].animRotation);
            twistCubes[i].animRotation = Mat4(Vec4(1, 0, 0, 0), Vec4(0, 1, 0, 0), Vec4(0, 0, 1, 0), Vec4(0, 0, 0, 1));
            twistCubes[i].inAnim = false;
            //alert(FlattenPoints(twistCubes[i].rotation));
        }

        cubelayout[2][0][2] = twistCubes[0].index;
        cubelayout[2][1][2] = twistCubes[1].index;
        cubelayout[2][2][2] = twistCubes[2].index;
        cubelayout[1][0][2] = twistCubes[3].index;
        cubelayout[1][1][2] = twistCubes[4].index;
        cubelayout[1][2][2] = twistCubes[5].index;
        cubelayout[0][0][2] = twistCubes[6].index;
        cubelayout[0][1][2] = twistCubes[7].index;
        cubelayout[0][2][2] = twistCubes[8].index;

        MoveStack.push("tbkr");

        if (NextMove !== undefined)
        {
            requestAnimFrame(NextMove);
        }
    }
    var Coroutine = tbrroutine();
    

    function tbrprogress()
    {
        if (Coroutine.next().done == false)
        {
            requestAnimFrame(tbrprogress);
        }
    }

    tbrprogress();
}


//Heavy Callbacks
function SolveStart()
{
    MoveStack.push("LOL");
    MoveStack.push("Lol2");
    Solve();
}

function Solve()
{
    MoveStack.pop();
    MoveStack.pop(); //Only way this function is called is after an undo operation or SolveStart(), in both cases there's two items needing to be removed.
    
    if (NextMove === undefined)
    {
        NextMove = Solve;
    }
    else if (NextMove !== Solve)
    {
        return;
    }
    var popped = MoveStack.pop();
    MoveStack.push(popped); //Keep the stack in a valid state in case routine gets interrupted.
    switch (popped)
    {
        case "ttl": 
            TwistTopRight();
            break;
        case "tml":
            TwistMiddleRight();
            break;
        case "tbl":
            TwistBottomRight();
            break;
        case "ttr":
            TwistTopLeft();
            break;
        case "tmr":
            TwistMiddleLeft();
            break;
        case "tbr":
            TwistBottomLeft();
            break;
        case "tlu": 
            TwistLeftDown();
            break;
        case "tmu": 
            TwistMiddleDown();
            break;
        case "tru": 
            TwistRightDown();
            break;
        case "tld": 
            TwistLeftUp();
            break;
        case "tmd": 
            TwistMiddleUp();
            break;
        case "trd": 
            TwistRightUp();
            break;
        case "tfl": 
            TwistFrontRight();
            break;
        case "tcl":
            TwistCenterRight();
            break;
        case "tbkl":
            TwistBackRight();
            break;
        case "tfr":
            TwistFrontLeft();
            break;
        case "tcr":
            TwistCenterLeft();
            break;
        case "tbkr":
            TwistBackLeft();
            break;
        case undefined:
            NextMove = undefined;
            return;
        default: 
            //MoveStack.pop();
            alert("Problem is here.");
            return;
    }
    //Our undo Operation still pushes to the stack, so we need to clear that.
    //MoveStack.pop();
}

function StartRandomizeCube()
{
    Randomizations = document.getElementById("Randomizations").value;

    RotationSpeed = 30;
    
    RandomizeCube();
}

function RandomizeCube()
{
    //alert(Randomizations);
    
    if (NextMove === undefined)
    {
        NextMove = RandomizeCube;
    }
    else if (NextMove !== RandomizeCube)
    {
        RotationSpeed = 5;
        return;
    }
    if (Randomizations <= 0)
    {
        NextMove = undefined;
        RotationSpeed = 5;
        return;
    }
    var rand = Math.floor(Math.random()*18);

    switch (rand)
    {
        case 0: 
            TwistTopRight();
            break;
        case 1:
            TwistMiddleRight();
            break;
        case 2:
            TwistBottomRight();
            break;
        case 3:
            TwistTopLeft();
            break;
        case 4:
            TwistMiddleLeft();
            break;
        case 5:
            TwistBottomLeft();
            break;
        case 6: 
            TwistLeftDown();
            break;
        case 7: 
            TwistMiddleDown();
            break;
        case 8: 
            TwistRightDown();
            break;
        case 9: 
            TwistLeftUp();
            break;
        case 10: 
            TwistMiddleUp();
            break;
        case 11: 
            TwistRightUp();
            break;
        case 12: 
            TwistFrontRight();
            break;
        case 13:
            TwistCenterRight();
            break;
        case 14:
            TwistBackRight();
            break;
        case 15:
            TwistFrontLeft();
            break;
        case 16:
            TwistCenterLeft();
            break;
        case 17:
            TwistBackLeft();
            break;
    }
    Randomizations--;
}