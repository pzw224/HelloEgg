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
            List<Banana> result = nameList.FindAll(Compare);
            foreach (var item in result)
            {
                Response.Write(item.Name);
            }


            List<Duang> m = new List<Duang>();
            m.Add(new Duang() { sex = 0, name = "jack" });
            m.Add(new Duang() { sex = 1, name = "Rose" });
            m.Add(new Duang() { sex = 2, name = "WuLaGui" });
            var fathers = ConvertProductInfos(m, GetFather);
            foreach (var f in fathers)
            {
                Response.Write(string.Format("<h2>爸爸：性别-{0}</h2>", f.sex));
            }

            var sons = ConvertProductInfos(m, GetSon);
            foreach (var s in sons)
            {
                Response.Write(string.Format("<h2>儿子：性别-{0},名字{1}</h2>", s.sex,s.name));
            }
            


        }

        private static Son AutoCopy(Father parent)
        {
            Son productListItemInfo = new Son();
            var cellInfoType = typeof(Father);
            var Properties = cellInfoType.GetProperties();
            foreach (var Propertie in Properties)
            {
                if (Propertie.CanRead && Propertie.CanWrite)
                {
                    Propertie.SetValue(productListItemInfo, Propertie.GetValue(parent, null), null);
                }
            }
            return productListItemInfo;
        }

        private Father GetFather(Duang d)
        {
            Father f = new Father();
            f.sex = d.sex;
            return f;
        }

        private Son GetSon(Duang d)
        {
            Son s = AutoCopy(GetFather(d));
            s.name = d.name;
            return s;
        }

        private static List<T2> ConvertProductInfos<T1, T2>(List<T1> productDeals, Func<T1, T2> action)
        {
            if (productDeals == null) return default(List<T2>);
            List<T2> t2List = new List<T2>();
            foreach (var item in productDeals)
            {
                t2List.Add(action(item));
            }
            return t2List;
        }


        protected bool Compare(Banana a)
        {
            return a.Index > 3;
        }
    }

    public class Father
    {
        public int sex { get; set; }
    }

    public class Son : Father
    {
        public string name { get; set; }
    }

    public class Duang
    {
        public int sex { get; set; }
        public string name { get; set; }
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