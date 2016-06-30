using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Collections;
using System.IO;

namespace MyTest
{
    public partial class ASPStudy : System.Web.UI.Page
    {
        public StringBuilder sb = new StringBuilder();
        protected void Page_Load(object sender, EventArgs e)
        {
            Generosity();
            ArrayTest();
            main.InnerHtml = sb.ToString();
            IEnumeratorTest();
            SayHello();
            StructuraEquatable();
            GetVector();
            GetDelegate();
            MyLambda();
        }

        #region 泛型
        public void Generosity()
        {
            sb.Append("<h1>泛型</h1>");
            sb.AppendFormat("<h2>泛型接口：</h2>");
            Person p = new Person("Jack");
            Person p1 = new Person("Rose");
            int result = p.CompareTo(p1);
            sb.AppendFormat("<p>使用了泛型，无需再使用老式的Object，通过拆箱装箱操作。</p>");
            sb.AppendFormat("<h2>协变和抗变：</h2>");
            sb.AppendFormat("<h3>泛型接口的协变(关键字out)</h3>");
            sb.AppendFormat("可以使用实现泛型接口的派生类的实例赋值给实现泛型接口的基类的实例（泛型接口和委托的抗变协变需要.NET 4+）");
            IIndex<Rectangle> rectangles = RectangleCollection.GetRectangles();
            IIndex<Shape> shapes = rectangles;
            for (int i = 0; i < shapes.Count; i++)
            {
                sb.Append("<br />" + shapes[i].ToString());
            }
            sb.AppendFormat("<h3>泛型接口的抗变（关键字in）</h3>");
            IDisplay<Shape> shapeDisplay = new ShapeDisplay();
            IDisplay<Rectangle> rectangleDisplay = shapeDisplay;
            sb.AppendFormat(rectangleDisplay.Show(rectangles[0]));
            sb.AppendFormat("<h2>泛型方法</h2>");
            var accounts = new List<MyAccount>() {
                new MyAccount("Christian",1500),
                new MyAccount("Stephanie",2200),
                new MyAccount("Angela",1800),
                new MyAccount("Matthias",2400),
            };
            sb.AppendFormat(@"<p>['Christian':1500,'Stephanie',2200,'Angela',1800,'Matthias',2400]的和为{0}</p>", Algorithm.Accumulate<MyAccount, decimal>(accounts, (item, sum) => sum += item.Balance));
            sb.AppendFormat("<h3>泛型方法规范</h3>");
            sb.AppendFormat("<p>{0}</p>", Algorithm.Foo("abc"));
        }
        #endregion

        #region Array类
        public void ArrayTest()
        {
            sb.Append("<h1>Array类</h1>");
            CreateInstance();

        }

        /// <summary>
        /// 创建Array
        /// </summary>
        public void CreateInstance()
        {
            int[] lengths = { 2, 4 };
            int[] lowerBounds = { 1, 10 };
            Array racers = Array.CreateInstance(typeof(Person), lengths, lowerBounds);
            racers.SetValue(new Person { Name = "张三", LastName = "疯" }, index1: 1, index2: 10);
            racers.SetValue(new Person { Name = "王", LastName = "五" }, index1: 1, index2: 11);
            racers.SetValue(new Person { Name = "李四", LastName = "虎" }, index1: 1, index2: 12);
            racers.SetValue(new Person { Name = "王", LastName = "五" }, index1: 1, index2: 13);

            racers.SetValue(new Person { Name = "赵", LastName = "六" }, index1: 2, index2: 10);
            racers.SetValue(new Person { Name = "清", LastName = "七" }, index1: 2, index2: 11);
            racers.SetValue(new Person { Name = "程", LastName = "八" }, index1: 2, index2: 12);
            Person[,] racers2 = (Person[,])racers;
            Person first = racers2[1, 10];
            Person last = racers2[2, 12];
            sb.AppendFormat("<p>Array的第一个对象{0},最后一个对象{1}</p>", first.Name + first.LastName, last.Name + last.LastName);

            Person[] persons = {
                                new Person{ Name="A",LastName="Wen"},
                                new Person{ Name="P",LastName="Lan"},
                                new Person{ Name="B",LastName="Zhi"},
                                new Person{ Name="C",LastName="Kart"},
                                new Person{ Name="B",LastName="Zhi"},

                            };
            Array.Sort(persons);
            foreach (Person item in persons)
            {
                sb.AppendFormat("{0}<br />", item.Name + item.LastName);
            }

        }
        #endregion

        #region IEnumerator
        private void IEnumeratorTest()
        {
            //例1：
            List<Shape> shapes = new List<Shape>();
            shapes.Add(new Shape
            {
                Width = 1,
                Height = 2
            });
            shapes.Add(new Shape
            {
                Width = 3,
                Height = 4
            });
            shapes.Add(new Shape
            {
                Width = 5,
                Height = 6
            });
            IEnumerator<Shape> enumerator = shapes.GetEnumerator();
            while (enumerator.MoveNext())
            {
                Shape s = enumerator.Current;
                main.InnerHtml += string.Format("<p>{0}</p>", s);
            }

            //例2:
            List<Person> persons = new List<Person>();
            persons.Add(new Person { Name = "a", LastName = "b" });
            persons.Add(new Person { Name = "c", LastName = "d" });
            persons.Reverse(0, persons.Count);
            foreach (var item in persons)
            {
                main.InnerHtml += string.Format("<p>{0}</p>", item);
            }
        }
        #endregion

        #region 迭代器，yield语句
        public IEnumerator<string> GetEnumerator()
        {
            yield return "Hello";
            yield return "World";
        }

        public void SayHello()
        {
            main.InnerHtml += "<h1>迭代器</h1>";
            ASPStudy sayHello = new ASPStudy();
            foreach (var item in sayHello)
            {
                main.InnerHtml += string.Format("{0} ", item);
            }
        }
        #endregion

        #region 结构比较
        private void StructuraEquatable()
        {
            StringBuilder txt = new StringBuilder();
            txt.Append("<h1>结构比较</h1>");
            var janet = new People { FirstName = "Janet", LastName = "Jackson" };
            People[] people1 = new People[] { new People { FirstName = "Michael", LastName = "Jackson" }, janet };
            People[] people2 = new People[] { new People { FirstName = "Michael", LastName = "Jackson" }, janet };
            if (people1 != people2) { txt.Append("<p>not the same reference</p>"); }
            if ((people1 as IStructuralEquatable).Equals(people2, EqualityComparer<People>.Default))
            {
                txt.Append("<p>the same content</p>");
            }

            #region 元组比较
            var t1 = Tuple.Create<int, string>(1, "Stephanie");
            var t2 = Tuple.Create<int, string>(1, "Stephanie");
            if (t1 != t2)
            {
                txt.Append("<p>not the same reference to the Tuple</p>");
            }
            if (t1.Equals(t2))
            {
                txt.Append("<p>the same content</p>");
            }


            #endregion

            main.InnerHtml += txt.ToString();
        }
        #endregion

        #region Vector结构
        protected void GetVector()
        {
            Vector v1, v2, vAdd;
            v1 = new Vector(1, 2, 3);
            v2 = new Vector(-6, 9, -4);
            vAdd = v1 + v2;
            StringBuilder html = new StringBuilder();
            html.Append("<ul>");
            html.AppendFormat("<li>v1:{0}</li>", v1);
            html.AppendFormat("<li>v2:{0}</li>", v2);
            html.AppendFormat("<li>vAdd:{0}</li>", vAdd);
            html.Append("</ul>");
            main.InnerHtml += html.ToString();
        }
        #endregion

        #region 委托
        delegate double DoubleOp(double value);
        Action<double, StringBuilder>[] ActionOp;
        Func<double, double>[] FuncOp;
        public void GetDelegate()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<div class='clear'>");
            #region delegate
            sb.Append("<h1>委托</h1>");
            sb.Append("<div class='fl'><h2>一个简单的委托</h2>");
            DoubleOp[] oprations ={
                                 MathOperation.MultiplyByTwo,
                                 MathOperation.Square
                                 };
            double a = 2.0, b = 7.94, c = 1.414;
            for (int i = 0; i < oprations.Length; i++)
            {
                sb.AppendFormat("<p>Using operations:{0}</p>", i);
                sb.AppendFormat("<p>Value is {0},result of opration is {1}.</p>", a, ProcessAndDisplayNumber(oprations[i], a));
                sb.AppendFormat("<p>Value is {0},result of opration is {1}.</p>", b, ProcessAndDisplayNumber(oprations[i], b));
                sb.AppendFormat("<p>Value is {0},result of opration is {1}.</p>", c, ProcessAndDisplayNumber(oprations[i], c));
            }
            sb.Append("</div>");
            #endregion
            #region Action<T,T1,T2> 无返回值
            sb.Append("<div class='fl'><h2>Action委托</h2>");
            ActionOp = new Action<double, StringBuilder>[]
            {
                MathOperation.ActMultiplyByTwo,
                MathOperation.ActSquare
            };
            for (int i = 0; i < ActionOp.Length; i++)
            {
                sb.AppendFormat("<p>Using operations:{0}</p>", i);
                ActionOp[i](a, sb);
                ActionOp[i](b, sb);
                ActionOp[i](c, sb);
            }
            sb.Append("</div>");
            #endregion
            #region Func<T,T1,TResult> TResult为返回类型
            sb.Append("<div class='fl'><h2>Func委托</h2>");
            FuncOp = new Func<double, double>[]
            {
                MathOperation.MultiplyByTwo,
                MathOperation.Square
            };
            for (int i = 0; i < FuncOp.Length; i++)
            {
                sb.AppendFormat("<p>Using operations:{0}</p>", i);
                sb.AppendFormat("<p>Value is {0},result of opration is {1}.</p>", a, FuncOp[i](a));
                sb.AppendFormat("<p>Value is {0},result of opration is {1}.</p>", b, FuncOp[i](b));
                sb.AppendFormat("<p>Value is {0},result of opration is {1}.</p>", c, FuncOp[i](c));
            }
            sb.Append("</div>");
            #endregion

            sb.Append("</div>");
            main.InnerHtml += sb.ToString();
        }

        private double ProcessAndDisplayNumber(DoubleOp action, double value)
        {
            double result = action(value);
            return result;
        }
        #endregion

        #region lambda表达式
        public void MyLambda()
        {
            string mid = ", middle part,";
            Func<string, string> lambda = param =>
            {
                param += mid;
                param += " and this was added to the string";
                return param;
            };
            lblLambda.Text = lambda("start of string");
        }
        #endregion

        #region 事件
        
        #endregion

    }

    #region 泛型接口

    public partial class Person : IComparable<Person>
    {
        public override string ToString()
        {
            return Name + LastName;
        }

        public Person(string lastName)
        {
            this.lastName = lastName;
        }

        private string lastName;
        public string LastName
        {
            get { return lastName; }
            set { lastName = value; }
        }

        public int CompareTo(Person other)
        {
            if (other == null) return 1;
            int result = string.Compare(this.LastName, other.LastName);
            if (result == 0)
            {
                result = string.Compare(this.Name, other.Name);
            }
            return result;
        }

        public int CompareTo(object obj)
        {
            Person other = obj as Person;
            return this.LastName.CompareTo(other.LastName);
        }
    }
    #endregion

    #region 协变和抗变
    public class Shape
    {
        public double Width { get; set; }
        public double Height { get; set; }

        public override string ToString()
        {
            return string.Format("Width:{0},Height:{1}", Width, Height);
        }
    }

    public class Rectangle : Shape
    {

    }

    #region 泛型接口的协变
    /// <summary>
    /// 泛型接口的协变，使用了out关键字，意味着返回类型只能是T
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IIndex<out T>
    {
        //只读索引器
        T this[int index] { get; }
        int Count { get; }
    }


    public class RectangleCollection : IIndex<Rectangle>
    {
        private Rectangle[] data = new Rectangle[3]
        {
            new Rectangle{Height=2,Width=5},
            new Rectangle{Height=3,Width=7},
            new Rectangle{Height=4.5,Width=2.9}
        };
        private static RectangleCollection coll;
        public static RectangleCollection GetRectangles()
        {
            //合并运算符，如果coll为null，则返回它的右侧
            return coll ?? (coll = new RectangleCollection());
        }

        public Rectangle this[int index]
        {
            get
            {
                if (index < 0 || index > data.Length) throw new ArgumentOutOfRangeException("index");
                return data[index];
            }
        }

        public int Count
        {
            get
            {
                return data.Length;
            }
        }
    }
    #endregion

    #region 泛型接口的抗变
    /// <summary>
    /// 泛型类型使用in关键字，泛型接口是抗变的。接口只能把泛型类型T用作方法的输入
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IDisplay<in T>
    {
        string Show(T item);
    }

    public class ShapeDisplay : IDisplay<Shape>
    {
        public string Show(Shape s)
        {
            return string.Format("<p>{0} Width：{1},Height：{2}</p>", s.GetType().Name, s.Width, s.Height);
        }


    }
    #endregion

    #region 泛型方法
    public interface IAccount
    {
        decimal Balance { get; }
        string Name { get; }
    }

    public class MyAccount : IAccount
    {
        public decimal Balance { get; private set; }
        public string Name { get; private set; }

        public MyAccount(string name, decimal balance)
        {
            this.Balance = balance;
            this.Name = name;
        }
    }

    public static class Algorithm
    {
        public static T2 Accumulate<T1, T2>(IEnumerable<T1> source, Func<T1, T2, T2> action) where T1 : IAccount
        {
            T2 sum = default(T2);
            foreach (T1 item in source)
            {
                sum = action(item, sum);
            }
            return sum;
        }

        public static string Foo<T>(T obj)
        {
            StringBuilder str = new StringBuilder();
            str.AppendFormat("Foo<T>(T obj),obj type:{0}", obj.GetType().Name);
            return str.ToString();
        }

        public static string Foo(int x)
        {
            return "Foo(int x)";
        }
    }
    #endregion


    #endregion

    #region 结构比较
    class TupleCompareer : IEqualityComparer
    {
        public new bool Equals(object x, object y)
        {
            return x.Equals(y);
        }

        public int GetHashCode(object obj)
        {
            return obj.GetHashCode();
        }
    }

    public class People : IEquatable<People>
    {
        public int Id { get; private set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public override string ToString()
        {
            return String.Format("{0},{1} {2}", Id, FirstName, LastName);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
                return base.Equals(obj);
            return Equals(obj as People);
        }

        public bool Equals(People other)
        {
            if (other == null)
            {
                return base.Equals(other);
            }
            return this.Id == other.Id && this.FirstName == other.FirstName && this.LastName == other.LastName;
        }
    }
    #endregion

    #region Vector结构
    struct Vector
    {
        public double x, y, z;

        public Vector(double x, double y, double z)
        {
            this.x = x; this.y = y; this.z = z;
        }

        public Vector(Vector rhs)
        {
            this.x = rhs.x; this.y = rhs.y; this.z = rhs.z;
        }

        public override string ToString()
        {
            return "（" + x + "," + y + "," + z + ")";
        }

        /// <summary>
        /// operator用于申明运算符
        /// </summary>
        public static Vector operator +(Vector lhs, Vector rhs)
        {
            Vector result = new Vector(lhs);
            result.x += rhs.x;
            result.y += rhs.y;
            result.z += rhs.z;
            return result;
        }
    }
    #endregion

    #region 委托
    class MathOperation
    {
        public static double MultiplyByTwo(double value)
        {
            return value * 2;
        }

        public static double Square(double value)
        {
            return value * value;
        }

        public static void ActMultiplyByTwo(double value, StringBuilder sb)
        {
            sb.AppendFormat("<p>Value is {0},result of opration is {1}.</p>", value, value * 2);
        }

        public static void ActSquare(double value, StringBuilder sb)
        {
            sb.AppendFormat("<p>Value is {0},result of opration is {1}.</p>", value, value * value);
        }
    }
    #endregion

    #region 事件

    #endregion
}