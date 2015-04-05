maxResults=50;

function getFirstYouTubeComments(videoId){
    commentQueryUrl="http://gdata.youtube.com/feeds/api/videos/"+videoId+"/comments/?max-results="+maxResults+"&alt=json"
    $.ajax({
        url: commentQueryUrl,
        dataType: "jsonp",
        success: function (data) {  
            numberOfAllComments = data.feed.openSearch$totalResults.$t;
            Session.set("comments", data.feed.entry)
            //if video has more then ::maxResults:: comments
            Session.set("nextCommentLink", getNextCommentLink(data.feed.link))
        }
    });
}
function getNextCommentLink(link){
    for (var i=0; i<link.length; i++){
        if(link[i].rel === "next")
            return link[i].href
    }
    console.log("End of comments.")
    return false
}

function getAllComments() {
    $.ajax({
        url: Session.get("nextCommentLink"),
        dataType: "jsonp",
        success: function (data) {
            comments = Session.get("comments")
            comments = comments.concat(data.feed.entry)
            Session.set("comments", comments)
            nextCommentLink = getNextCommentLink(data.feed.link)
            Session.set("nextCommentLink", nextCommentLink)
        }
    });
}
  

Template.comments.helpers({
    comments: function(){
        return Session.get("comments");
    },
});
Template.more.events={
    "click .load-more": function(e){
        getAllComments();
    }
}
Template.more.helpers({
    moreResults : function() {
        return (Session.get("nextCommentLink"));
    }
})
Template.search.events={
    "click #submit": function(e){
        value = $("#search").val()
            if(value!=""){
                getFirstYouTubeComments(value)
            }

    },
    "keypress #search" : function(e) {
        if(e.which == 13) {
            value = $("#search").val()
            if(value!=""){
                getFirstYouTubeComments(value)
                }
            }
    }
}



