using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace MyTest.DotNetQuestion.Redirect302
{
    public partial class Redirect302 : System.Web.UI.Page
    {

        protected override void OnPreInit(EventArgs e)
        {
            Response.Redirect("B.aspx");
            base.OnPreInit(e);
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}