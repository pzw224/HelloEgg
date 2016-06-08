using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IServiceInterface
{
    //第一层抽象：邮件服务接口
    public interface IMessageService
    {
        string SendMessage();
    }
}
