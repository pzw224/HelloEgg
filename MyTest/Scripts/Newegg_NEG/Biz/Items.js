NEG.Module('Biz.Items',function(require) {
    //Web.UI.Items
    var neweggItems = {
        isStandardItem: function(item) {
            return item ? (/^\d{2}\-\d{3}\-\d{3}[r|c]?$/gi).test(item) : false;
        },isNeweggItem: function(item) {
            if (item) {
                return (item.toUpperCase().indexOf('N82E168') > -1);
            }
            return false;
        },isParentItem: function(item) {
            if (item) {
                return (/^[^-]{3}-[^-]{4}-[^-]{5,6}$/gi).test(item);
            }
            return false;
        },isSFItem: function(item) {
            if (item) {
                return (/^\d+sf/gi).test(item);
            }
            return false;
        },isDVDorBooksItem: function(item) {
            if (item) {
                return (/^\d{12,13}[r|c]?$/gi).test(item);
            }
            return false;
        },isSNETItem: function(item) {
            if (item) {
                return (/^snet-\d{6}$/gi).test(item);
            }
            return false;
        },isINItem: function(item) {
            if (item) {
                return (/^[^-]{2}-[^-]{4}-in$/gi).test(item);
            }
            return false;
        },isTSItem: function(item) {
            if (item) {
                return (/^\d+ts/gi).test(item);
            }
            return false;
        },isCVFItem: function(item) {
            if (item) {
                return (/^\d{2}\-\d{3}\-\d{3}cvf$/gi).test(item);
            }
            return false;
        },isAutoPartsItem: function(item) {
            if (item) {
                return (/^9at[^-]{4}[^-]{7,8}/gi).test(item);
            }
            return false;
        },isSellerItem: function(item) {
            if (item) {
                return (/^9si[^-]{4}[^-]{7,8}/gi).test(item);
            }
            return false;
        },isGCItem: function(item) {
            if (item) {
                return (/^gc-[^-]{3}-[^-]{3}$/gi).test(item);
            }
            return false;
        }
    };
    return neweggItems;
});