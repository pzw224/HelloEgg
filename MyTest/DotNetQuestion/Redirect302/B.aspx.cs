using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace MyTest.DotNetQuestion.Redirect302
{
    public partial class B : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var a= Request.ServerVariables["Http_Referer"];
            var b = Request.UrlReferrer;
            if (b != null)
            {
                Response.Write(b.AbsolutePath.ToString()+"<br />");
            }
            Response.Write(a.ToString());
        }
    }
}