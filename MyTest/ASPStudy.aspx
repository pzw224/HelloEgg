<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ASPStudy.aspx.cs" Inherits="MyTest.ASPStudy" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>c#高级编程</title>
    <link href="html5/css/main.css" rel="stylesheet" />
    <script type="text/javascript">
        var a = { abc: 'I\'m very happy' };
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="main" runat="server">
    
    </div>
    <div id="main2" runat="server">
        <h2>Lambda表达式</h2>
        <asp:Label ID="lblLambda" runat="server"></asp:Label>
        <h2>事件</h2>
        <p id="myEvent" runat="server"></p>
    </div>
    </form>
</body>
</html>
