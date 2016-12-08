var utils = require('./utils.js');
var catergoryPages = require('./category.js');
var loadFeed=require("./load.feed.js");
var videosFeed=require("./videos.feed.js");
var newsDetails=require("./news-details.js");
var googleAnalytics=require("./analytics.js");
var drawable=require("./drawable.js");
var aboutPage=require('./pages/about.js');

/**
  ////////////////////////
  Configurations
  ///////////////////////
*/
var IMAGE_PATH='images/';
var PAGE_MARGIN = 16;
var IMAGE_SIZE = 120;
var MARGIN = 12;
var MARGIN_LARGE = 24;
var NEWS_URL='http://www.myradio360.com/api/';

var about_page=aboutPage.createAboutPage(PAGE_MARGIN);


//////////////////////////////////////////////////////
tabris.ui.set("background", "#D71A21");



var drawer = new tabris.Drawer()
  .on("open", function() {
    //console.log("drawer opened");
  })
  .on("close", function() {
    //console.log("drawer closed");
  });
  
var drawablePages= {about:aboutPage};
drawable.Menu(drawer,IMAGE_PATH,drawer,drawablePages,PAGE_MARGIN);

var page = new tabris.Page({
  title: 'Radio360',
  topLevel: true
});
  page.open();

var shareAction = tabris.create("Action", {
    id: "shareaction",
    title: "Share",
    image: "images/action_share.png"
  });

tabris.ui.children("#shareaction").set("visible",false);
//var drawer = new tabris.Drawer();
var tabFolder = tabris.create("TabFolder", {
  left: 0, top: 0, right: 0, bottom: 0,
  background: "#D71A21",
  textColor: "#fff",
  paging: true,
  tabBarLocation:'auto',
  elevation: 4
}).appendTo(page);
 

var createTab = function(title, image) {
  var tabObj=tabris.create("Tab", {
  /*image: {src: image},*/
    title:title,
    background: "#fff"
  }).appendTo(tabFolder);
  return tabObj;
};

/////////////////////////////////////////////////



//googleAnalytics.applyAnalytics();
//admob.initAdmob("ca-app-pub-1774560463484862/7692645632","ca-app-pub-1774560463484862/7553044832");
//admob.cacheInterstitial();// load admob Interstitial

/*admob.isInterstitialReady(function(isReady){
  if(isReady){
      admob.showInterstitial();
  }
});*/
//admob.showBanner(admob.BannerSize.BANNER,admob.Position.BOTTOM_CENTER);


function loadNewItems(view,json_url,key)
{
  var items = [];
  itemsView = view.get("items");
  //page=parseInt(itemsView[itemsView.length-1].page);
  current_page=localStorage.getItem('current_page_'+key);
  current_page++;
  //console.log('current_page: '+current_page);
  localStorage.setItem('current_page_'+key,current_page);
   json_url=json_url+'&page='+current_page;

   utils.getJSON(json_url).then(function (json) {
       localStorage.setItem(key,JSON.stringify(json));
          view.insert(json.items);
    });


}

function load_news(view,newsData,key)
{
  
  newsitems=JSON.parse(localStorage.getItem(key));
 /* view.set({
      items: newsitems,
      refreshIndicator: true,
      refreshMessage: ""
    });*/

  newsitems=newsData.items;
  setTimeout(function() {
    view.set({
      items: newsitems,
      refreshIndicator: false,
      refreshMessage: "loading..."
    });
  }, 3000);
}

function load_topNews(newsData,key,topStoryImage,topStoryTitle)
{
  newsitems=JSON.parse(localStorage.getItem(key));
  newsitems=newsData.items;
  topStoryImage.set("image", {src: newsitems[0].image});
  topStoryTitle.set("title", "<b>"+newsitems[0].title+"</b>");
  //console.log(newsitems[0].title);
}


/////////////////////////////////////

function createItems(firstsection=false,json_url,image_size, margin,targt_page,detail_page,shareAction,storage_key)
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

      if(firstsection==true)
      {
          loadFeed.fetch_newslist(collectionView_News,json_url,storage_key);
          
      }
      else
      {
         loadFeed.fetch_other_newslist(collectionView_News,json_url,storage_key);
      }

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



function pageUrl(category='news')
{
  //console.log(NEWS_URL+'?category='+category);
  return NEWS_URL+'?category='+category;
}


function load_topNews(newsData,key,topStoryImage,topStoryTitle)
{
  newsitems=JSON.parse(localStorage.getItem(key));
  newsitems=newsData.items;
  topStoryImage.set("image", {src: newsitems[0].image});
  topStoryTitle.set("title", "<b>"+newsitems[0].title+"</b>");
  //console.log(newsitems[0].title);
}


var newsTab=createTab('News');
var politicsTab=createTab('Politics');
var sportsTab=createTab('Sports');
var businessTab=createTab('Business');
//var entertainmentTab=createTab('Entertainment');
// var internationalTab=createTab('International');
// var technologyTab=createTab('Technology');


//createItems(false,pageUrl('entertainment'),IMAGE_SIZE, MARGIN,entertainmentTab,newsDetails,shareAction,'entertainment_list');
// createItems(false,pageUrl('world'),IMAGE_SIZE, MARGIN,internationalTab,newsDetails,shareAction,'international_list');
// createItems(false,pageUrl('technology'),IMAGE_SIZE, MARGIN,technologyTab,newsDetails,shareAction,'technology_list');
tabFolder.on("select", function (widget, tab) {
  //  admob.showInterstitial();
  if(tab.get("title")=='Fan Videos')
  {
    //createItems(pageUrl('videos'),IMAGE_SIZE, MARGIN,fanVideoTab,'videos_list');
  }
});
/* setTimeout(function() {
 // admob.cacheInterstitial();// load admob Interstitial
  //admob.isInterstitialReady(function(isReady){
    //admob.showInterstitial();
  //});



  }, 20000);*/
  //createItems(true,pageUrl('news'),IMAGE_SIZE, MARGIN,newsTab,newsDetails,shareAction,'news_list');
createItems(false,pageUrl('politics'),IMAGE_SIZE, MARGIN,politicsTab,newsDetails,shareAction,'politics_list');
createItems(false,pageUrl('sports'),IMAGE_SIZE, MARGIN,sportsTab,newsDetails,shareAction,'sports_list');
createItems(false,pageUrl('business'),IMAGE_SIZE, MARGIN,businessTab,newsDetails,shareAction,'business_list');


//newsCollectionView=createCollectionView(IMAGE_SIZE, MARGIN,newsTab,'news_list');
//videosCollectionView=createCollectionView(IMAGE_SIZE, MARGIN,fanVideoTab,'videos_list');

//loadFeed.getNewsList(pageUrl('news'),IMAGE_SIZE,MARGIN,newsTab,newsCollectionView,'news_list');
//loadFeed.fetch_newslist(newsCollectionView,pageUrl('news'),'news_list');

//loadFeed.getNewsList(pageUrl('videos'),IMAGE_SIZE,MARGIN,fanVideoTab,videosCollectionView,'videos_list');
//loadFeed.fetch_other_newslist(videosCollectionView,pageUrl('videos'),'videos_list');

/*loadFeed.getNewsList(pageUrl('videos'),IMAGE_SIZE,MARGIN,fanVideoTab,createCollectionView(IMAGE_SIZE, MARGIN,fanVideoTab,'videos_list'),'videos_list');*/

