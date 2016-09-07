using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using Model.Entity;

namespace Model
{
    public class Class1 : DbContext
    {
        MyDataBaseEntities context = new MyDataBaseEntities();

        public UserAccount GetUser(int userID)
        {
            var userAccount = context.UserAccount.FirstOrDefault(p => p.UserID == userID);
            
            return userAccount;
        }
    }
}
