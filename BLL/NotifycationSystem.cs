using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IServiceInterface;
using IServiceInterface.Locator;

namespace BLL
{
    public class NotifycationSystem : IServiceLocator
    {
        //接口注入
        private IMessageService service; //邮件通知类保存服务实现的接口

        //public NotifycationSystem(IServiceLocator localtor)
        //{
        //    service = localtor.GetService<IMessageService>();//实现依赖关系被转移到类外
        //}

        public void GetService(IMessageService ims)
        {
            service = ims;
        }


        public string InterestingEventHappened()
        {
            return service.SendMessage();
        }
    }
}
