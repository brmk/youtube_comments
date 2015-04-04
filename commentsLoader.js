if(Meteor.isClient){
        var sum=0;
        function getFirstYouTubeComments(videoId, maxResults){
                commentQueryUrl="http://gdata.youtube.com/feeds/api/videos/"+videoId+"/comments/?max-results="+maxResults+"&alt=json"
                $.ajax({
                        url: commentQueryUrl,
                        dataType: "jsonp",
                        success: function (data) {  
                                sum+=data.feed.entry.length
                                console.log(data);
                                //console.log(data.feed.openSearch$itemsPerPage.$t);
                                numberOfAllComments = data.feed.openSearch$totalResults.$t;
                                numberOfReceivedComments = data.feed.entry.length;
                                console.log(numberOfAllComments)
                                //if video has more then ::maxResults:: comments
                                Session.set("comments", data.feed.entry)
                                if(numberOfAllComments>=maxResults){
                                        nextCommentLink = getNextCommentLink(data.feed.link)
                                        if (nextCommentLink!=false)
                                                getAllComments(nextCommentLink);
                                        else console.log("Error: nextCommentLink:" + nextCommentLink)
                                }
                        }
                });
        }
        function getNextCommentLink(link){
                for (var i=0; i<link.length; i++){
                        if(link[i].rel === "next")
                                return link[i].href
                }
                console.log("There is no 'next' link in JSON!")
                console.log("Found comments:", sum)
                return false
        }

        function getAllComments(nextCommentLink) {
                $.ajax({
                        url: nextCommentLink,
                        dataType: "jsonp",
                        success: function (data) {
                                sum+=data.feed.entry.length
                                comments = Session.get("comments")
                                comments = comments.concat(data.feed.entry)
                                Session.set("comments", comments)
                                console.log(data);
                                nextCommentLink = getNextCommentLink(data.feed.link)
                                if (nextCommentLink!=false)
                                        getAllComments(nextCommentLink);

                        }
                });
        }
 /*       Template.comments.rendered = 
                function(){
                        videoId="D8HqRH5cHPo"
                        maxResults = 50
                        getFirstYouTubeComments(videoId,maxResults);
                }
   */     

        Template.comments.helpers({
                comments: function(){
                        return Session.get("comments");
                }
        });

        Template.search.events={
                "click #submit": function(e){
                        value = $("#search").val()
                        console.log(value)
                                if(value!=""){
                                        $("#search").val("");
                                        getFirstYouTubeComments(value,50)
                                }

                },
                "keypress #search" : function(e) {
                        if(e.which == 13) {
                                value = $("#search").val()
                                console.log(value)
                                if(value!=""){
                                        $("#search").val("");
                                        getFirstYouTubeComments(value,50)
                                }
                        }
                }
        }

       

        
        
}