<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="XmlToObject.aspx.cs" Inherits="MyTest.XmlToObject" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <h1>xml反序列化</h1>
            <% 
                if (BaseConfig != null && BaseConfig.AdditionList != null && BaseConfig.AdditionList.Count > 0)
                {
                    foreach (var obj in BaseConfig.AdditionList)
                    {
                        Response.Write(obj.Name + "," + obj.Url + "," + obj.Text + "<br />");
                    }
                } %>
        </div>
    </form>
</body>
</html>
