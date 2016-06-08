using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;
using mytext = System.Text;

namespace MyTest
{
    public partial class _Default : Page
    {
        mytext::StringBuilder cph = new mytext::StringBuilder();
        protected void Page_Load(object sender, EventArgs e)
        {
            Dictionary<string, DataTable> data = new Dictionary<string, DataTable>();
            ConfigManager.MyTeam.GetPerson();
            TimeDay time = (TimeDay)Enum.Parse(typeof(TimeDay), "afternoon", true);
            enumText.InnerHtml = time.ToString() + ":" + ((int)TimeDay.afternoon).ToString();
            mytext::StringBuilder sb = new mytext.StringBuilder();
            ChildClass myclass = new ChildClass();

            GetCSharpHTML();
            csharpHtml.InnerHtml = cph.ToString();
        }

        protected void GetCSharpHTML()
        {
            #region 泛型类
            DocumentManager<int> dm = new DocumentManager<int>();
            dm.AddDocument(1);
            dm.AddDocument(2);
            dm.AddDocument(3);
            dm.GetDocument();
            if (dm.IsDocumentAvailable)
            {
                cph.Append("\n队列数目大于1");
            }

            //泛型静态成员
            DocumentManager<int>.x = 5;
            DocumentManager<string>.x = 6;
            cph.AppendFormat("<br />泛型类的静态成员只能在一个实例中共享。泛型类型为int，静态字段x：{0};泛型类型为int，静态字段x：{1};5的平方：{2}", DocumentManager<int>.x, DocumentManager<string>.x, dm.CompareTo(5).ToString());
            #endregion
        }

        public enum TimeDay
        {
            morning = 0,
            afternoon = 1,
            evening = 2
        }
    }

    /// <summary>
    /// 泛型接口
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IComparableDefault<T>
    {
        int CompareTo(T other);
    }

    public class DocumentManager<T> : MyTest.IComparableDefault<int>
    {

        public int CompareTo(int other)
        {
            return other * other;
        }

        //泛型静态成员
        public static int x;

        //初始化一个只读泛型队列
        private readonly Queue<T> documentQueue = new Queue<T>();
        public void AddDocument(T doc)
        {
            lock (this)
            {
                //将doc添加到队列中
                documentQueue.Enqueue(doc);
            }
        }

        /// <summary>
        /// 默认值
        /// </summary>
        /// <returns></returns>
        public T GetDocument()
        {
            //default关键字，将null赋予引用类型，将0赋予值类型
            T doc = default(T);
            lock (this)
            {
                //移除队列中的第一个对象
                doc = documentQueue.Dequeue();
            }
            return doc;
        }

        public bool IsDocumentAvailable
        {
            get
            {
                //如果队列数目大于1，返回true
                return documentQueue.Count > 1;
            }
        }
    }

    struct Demensions
    {
        //结构中，不允许使用无参数构造函数。提供字段的初始值也不能绕过构造函数
        //public int age = 19; 编译报错
        public int age;
        public Demensions(string name)
        {
            age = 19;
        }
    }

    public class MyClass
    {
        public MyClass First
        {
            get;
            set;
        }

        public MyClass(string name)
        {
            //code logic
        }

        /// <summary>
        /// 调用本类的其他构造函数
        /// </summary>
        public MyClass()
            : this("Payne")
        {
            //code logic
        }

        /// <summary>
        /// 静态构造函数
        /// 只执行一次，执行顺序不确定，不应把需要顺序的code放在此方法中
        /// 用例场景：类有一些静态字段或属性，需要在第一次使用类之前，从外部源初始化这些静态字段和属性
        /// </summary>
        static MyClass()
        {

        }
    }

    public class ChildClass : MyClass
    {
        /// <summary>
        /// 调用基类构造函数
        /// </summary>
        public ChildClass()
            : base("Child")
        {

        }
    }

    public static class ConfigManager
    {

        private class InternalConfiguration
        {
            static private InternalConfiguration Config;

            public static InternalConfiguration GetInstance()
            {
                if (Config == null)
                {
                    Config = new InternalConfiguration();
                }
                return Config;
            }

            private Team _team;
            public Team Team
            {
                get { return _team; }
                set { _team = value; }
            }
        }


        private static InternalConfiguration Config;
        static ConfigManager()
        {
            if (Config == null)
            {
                Config = InternalConfiguration.GetInstance();
            }
        }

        public static Team MyTeam
        {
            get
            {
                Config.Team = new Team();
                return Config.Team;
            }
            set { Config.Team = value; }
        }
    }

    public class Team
    {
        public List<Person> GetPerson()
        {
            List<Person> personList = new List<Person>();
            Person person = new Person();
            person.Age = 24; person.Name = "Payne";
            personList.Add(person);
            return personList;
        }
    }

    public partial class Person
    {
        public Person() { }
        private int _age;
        public int Age
        {
            get { return _age; }
            set { _age = value; }
        }

        private string _name;
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
    }
}