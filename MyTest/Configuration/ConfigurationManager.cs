using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace MyTest.Configuration
{
    public class ConfigurationManager
    {
        static Object obj = new Object();
        private static ConfigurationManager config=null;

        public ConfigurationManager()
        {

        }

        public static ConfigurationManager GetConfigurationManager()
        {
            if (config == null)
            {
                lock (obj)
                {
                    if (config == null)
                    {
                        config = new ConfigurationManager();
                    }
                }
            }
            return config;
        }

        public T GetFromCach<T>(string path) where T : class
        {
            FileStream fs = null;
            try
            {
                T t = default(T);
                string xmlPath = System.AppDomain.CurrentDomain.BaseDirectory + System.Configuration.ConfigurationManager.AppSettings[path];
                fs = new FileStream(xmlPath, FileMode.Open, FileAccess.Read);
                XmlSerializer serializer = new XmlSerializer(typeof(T));
                t = serializer.Deserialize(fs) as T;
                fs.Close();
                return t;
            }
            catch
            {
                if (fs != null) fs.Close();
                return default(T);
            }
        }

    }
}