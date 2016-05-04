using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IServiceInterface.Locator
{
    //第二层抽象：服务定位器
    public interface IServiceLocator
    {
        //T GetService<T>();
        void GetService(IMessageService ims);
    }
}
