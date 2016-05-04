<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Test.aspx.cs" Inherits="MyTest.Test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>NEG</title>
    <script src="Scripts/jquery-1.7.1.min.js"></script>
    <script src="Scripts/Newegg_NEG/NEG.0.2.2.js"></script>
    
</head>
<body>
    <form id="form1" runat="server">
    <div id="module">
        <h1>Module</h1>
        <input type="button" id="btn_Action" value="按钮" />
    </div>
        <div>
            <%= SendEmail %>
        </div>
    </form>
</body>

<script type="text/javascript">


    //define NEG.Sample.ModuleA
    NEG.Module("NEG.Sample.ModuleA", function (require) {
        var moduleA = function (args) {
            //action
            $("#btn_Action").bind("click", function () {
                alert(1);
            });
            if (typeof (args) === "string") {
                var p = document.createElement("p");
                p.textContent = args;
                return p;
            }

            
        };
        return moduleA;
    });

    //define NEG.Sample.ModuleB
    NEG.Module("NEG.Sample.ModuleB", function (require) {
        var moduleB = function (args) {
            //action
        };
        return moduleB;
    });

    //define NEG.Sample.ModuleC
    NEG.Module("NEG.Sample.ModuleC", function (require) {
        var moduleA = require("NEG.Sample.ModuleA");
        var moduleB = require("NEG.Sample.ModuleB");
        var moduleC = function (args) {
            //action

            return moduleA(args.name);
        };
        return moduleC;
    });

    var p;
    //call ModuleC
    NEG.run(function (require) {
        var moduleC = require("NEG.Sample.ModuleC");
        var args = { name: "裴志文" };
         p = moduleC(args);
        document.getElementById("module").appendChild(p);
        //document.getElementById("module")
        //alert(p.innerText);

    });

    $(function () {
        var arrays = [1, 2, 3, 4, 5];
        for (var i in arrays) {
            arrays[i] = ++arrays[i];
            //alert(arrays[i]);
        }
        console.log(arrays.join());
    })
</script>
</html>
