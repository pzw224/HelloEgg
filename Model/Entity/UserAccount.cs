//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Model.Entity
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserAccount
    {
        public UserAccount()
        {
            this.UserAuthor = new HashSet<UserAuthor>();
        }
    
        public int ID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string Passwords { get; set; }
        public System.DateTime CreateTime { get; set; }
        public string Others { get; set; }
        public int IsDelete { get; set; }
    
        public virtual ICollection<UserAuthor> UserAuthor { get; set; }
    }
}