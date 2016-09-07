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


            List<Banana> nameList = new List<Banana>();
            nameList.Add(new Banana() { Index = 0, Name = "零" });
            nameList.Add(new Banana() { Index = 1, Name = "一" });
            nameList.Add(new Banana() { Index = 2, Name = "二" });
            nameList.Add(new Banana() { Index = 3, Name = "三" });
            nameList.Add(new Banana() { Index = 4, Name = "四" });
            nameList.Add(new Banana() { Index = 5, Name = "五" });
            nameList.Add(new Banana() { Index = 6, Name = "六" });
            List<Banana> result= nameList.FindAll(Compare);
            foreach (var item in result)
            {
                Response.Write(item.Name);
            }
            

        }


        protected bool Compare(Banana a)
        {
            return a.Index > 3;
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

    public class Banana
    {
        public string Name
        {
            get;
            set;
        }

        public int Index
        {
            get;
            set;
        }
    }


}