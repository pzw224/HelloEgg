using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MyTest.Configuration.ObjConfiguration;
using MyTest.Configuration;

namespace MyTest
{
    public partial class XmlToObject : System.Web.UI.Page
    {
        private BaseConfiguration baseConfig;
        public BaseConfiguration BaseConfig
        {
            get { return baseConfig; }
            set { baseConfig = value; }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                ConfigurationManager configManage = ConfigurationManager.GetConfigurationManager();
                baseConfig = configManage.GetFromCach<BaseConfiguration>("BaseDataConfigurationFile");

            }
        }
    }
}