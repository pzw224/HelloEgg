using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace MyTest.Configuration.ObjConfiguration
{
    [XmlRoot("configuration")]
    public class BaseConfiguration
    {
        [XmlElement("addition")]
        public List<Addition> AdditionList
        {
            get;
            set;
        }
    }

    public class Addition{
        [XmlAttribute("name")]
        public string Name
        {
            get;
            set;
        }

        [XmlAttribute("url")]
        public string Url
        {
            get;
            set;
        }


        [XmlText]
        public string Text
        {
            get;
            set;
        }
    }
}