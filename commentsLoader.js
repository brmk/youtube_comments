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
                                console.log(data);

                                nextCommentLink = getNextCommentLink(data.feed.link)
                                if (nextCommentLink!=false)
                                        getAllComments(nextCommentLink);

                        }
                });
        }

        $(document).ready(function () {
                videoId="vtAs6YiiRnM"
                maxResults = 50
                getFirstYouTubeComments(videoId,maxResults);
        });