var username="73a9b89e-4414-47a0-9cb8-0a16e7b46ce3";
var password="GJORLArYnWDB";
var wiki_concepts_URL="https://gateway.watsonplatform.net/concept-insights-beta/api/v1/graph/wikipedia/en-20120601?func=annotateText";
var corpus_search_URL="https://gateway.watsonplatform.net/concept-insights-beta/api/v1/searchable/"+username+"/salesadvisor";
var fetch_doc_URL="https://gateway.watsonplatform.net/concept-insights-beta/api/v1/corpus/73a9b89e-4414-47a0-9cb8-0a16e7b46ce3/salesadvisor/";

Meteor.methods({
	process_question: function(question) 
		{
		//console.log('Question is "'+question+'"');
		var concepts="";
        var result=HTTP.post(wiki_concepts_URL, 
							{
							"data":question,
							"auth":username+":"+password
							});
		if (result)
			{
			concepts=result.data;
			//console.log("Found concepts: ");
			//console.log(concepts);
			//console.log("\n\n");
			var wikis="";
			
			for (key in concepts)
				{
				//console.log(key+"="+concepts[key].concept);
				wikis+='"'+concepts[key].concept+'",';
				}
			wikis=wikis.substr(0,wikis.length-1); //eliminate the last comma
			
			var parms={"func":"semanticSearch",
						"limit":"5",
						"ids":"["+wikis+"]"};
			
			//now fetch the docs from the corpus, based on these concepts
			//console.log("Fetching corpus docs for these concepts:\n");
			//console.log(wikis);
			var corpusDocs=HTTP.get(corpus_search_URL, 
									{
									"params":parms,
									"auth":username+":"+password
									});	
			//console.log(corpusDocs);
			}
		return corpusDocs.data;
  		},
  
  	fetch_doc:function(docID)
  		{
  		//console.log("Fetching "+docID+" from corpus...");
  		var doc=HTTP.get(fetch_doc_URL+docID, 
									{
									"auth":username+":"+password
									});	
  		//console.log(doc.data.parts[0].data.substr(1,100)+"...");
  		return doc;
  		}
  	
  });

