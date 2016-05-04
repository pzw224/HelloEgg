using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IServiceInterface;

namespace ServiceImplementation
{
    public class EmailService : IMessageService
    {
        public string SendMessage()
        {
            return "发送邮件";
        }
    }
}
