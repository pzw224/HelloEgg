using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using Microsoft.Practices.Unity;

namespace MyTest
{
    public partial class Test : System.Web.UI.Page
    {
        public string SendEmail { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            //创建容器
            IUnityContainer container = new UnityContainer();
            //注册映射
            container.RegisterType<IKiss, Boy>();
            //得到Boy的实例
            var boy = container.Resolve<IKiss>();
            Lily lily = new Lily(boy);
            Response.Write(lily.Kiss());

            container.RegisterType<IKiss, GrandFather>();
            lily = new Lily(container.Resolve<IKiss>());
            Response.Write(lily.Kiss());

        }
    }

    public interface IKiss
    {
        string Kiss();
    }

    public class Lily : IKiss
    {
        public IKiss person;
        public Lily(IKiss _person)
        {
            person = _person;
        }

        public string Kiss()
        {
            StringBuilder str = new StringBuilder();
            str.Append(person.Kiss());
            str.Append("& Lily kissing");
            return str.ToString();
        }
    }

    public class Boy : IKiss
    {
        public string Kiss()
        {
            return "boy kissing";
        }
    }

    public class GrandFather : IKiss
    {
        const string GRANDFATHER = "SunShineMan";
        public string Kiss()
        {
            return GRANDFATHER + "kissing";
        }
    }


}