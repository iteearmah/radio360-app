exports.createCategoryPage=function(json_url,image_size, margin,detail_page,shareAction,storage_key)
{
  
	var pageTitle='Category Radio360';
	var page = new tabris.Page({title: pageTitle});
    createItems(json_url,image_size, margin,page,shareAction,storage_key);
    return page;
}


function createItems(json_url,image_size, margin,targt_page,detail_page,shareAction,storage_key)
{
   localStorage.setItem('current_page_'+storage_key,1);
   var collectionView_News = tabris.create("CollectionView", {
        layoutData: {left:0, right: 0, bottom: 50,top :[targt_page,2]},
        refreshEnabled: true,
        itemHeight: 120,
        id:storage_key,
        initializeCell: function(cell) {
          var imageView = tabris.create("ImageView", {
            layoutData: {width: image_size,left:5,bottom:10,top:5},
            scaleMode:"fill",
          }).appendTo(cell);
          var titleView = tabris.create("TextView", {
            layoutData: {top: 0, left: [imageView, margin], right: 5,top:5},
            markupEnabled: true,
            font: "15px Arial, sans-serif",
            textColor: "#000",
          }).appendTo(cell);
          var periodView = tabris.create("TextView", {
            layoutData: {top: [titleView, 40],left: [imageView, margin], right: 5},
            markupEnabled: true,
            textColor: "#D71A21"
          }).appendTo(cell);
         
           cell.on("change:item", function(widget, newsItems) {

            imageView.set("image", {src: newsItems.image});
            titleView.set("text", '<b>'+newsItems.title+'</b>');
            periodView.set("text", '<small>'+newsItems.pubDate+'</small>');
          });
          
          }
        });
     collectionView_News.on("refresh", function() {
          loadFeed.fetch_newslist(collectionView_News,json_url,storage_key);
      }).appendTo(targt_page);

         loadFeed.fetch_other_newslist(collectionView_News,json_url,storage_key);

   collectionView_News.on("scroll", function(view, scroll) {
     if( view.get('_loadingNext') || view.get('_loadedAll') ) { return; }
          if (scroll.deltaY > 0) {
            
            var totalItems=parseInt(view.get("items").length);
            var remaining = totalItems - parseInt(view.get("lastVisibleIndex"));
            
            if (remaining ==1) 
            {
             //console.log(' items count'+view.get("items").length+' | lastVisibleIndex: '+view.get("lastVisibleIndex"));
              loadFeed.loadNewItems(collectionView_News,json_url,storage_key);
            }

          }
  });

   collectionView_News.on("select", function(target, value) {
       var newsDetailPage=detail_page.news_readPage(value,shareAction);

        /**/

        newsDetailPage.set('title',value.title+' - News');
        newsDetailPage.open();
    });
}
