if (Meteor.isClient) {
  Template.answer.helpers({
    results: function () 
			{
			var a=Session.get('conceptList');
			if (!a) 
				{
				//console.log("Naught found");
				a=[{"label":"(No matching concepts found.)",
					"id":null}];
				}
			else 
				{
				//console.log(a);
				a=a.results;
				}
			return a;
			},
    concepts: function () 
			{
			var a=Session.get('conceptList');
			if (!a) 
				a=[{"abstract":"(No matching concepts found.)"}];
			else 
				a=a.concepts;
			return a;
			}
  });

  Template.info.helpers({

    corpdoc: function () 
			{
			var a=Session.get('corpusDoc');
			if (!a) 
				{
				a=[{"data":"(No documents.)"}];
				}
			else 
				a=a.data.parts;
			return a;
			}
  });

  Template.question.events({
    'click button, submit': function (event) {
		//console.log(event.type+" clicked!");
		
		//clear the previous results
		Session.set('conceptList',null);
		Session.set('corpusDoc',null);
		var text = document.forms["natural"].quest.value;
		//console.log(text);
		Session.set("conceptList",[{"label":"Asking..."}]);
		Meteor.call("process_question", text, function(err, response) 
			{
   			if (response)
   				{
				//console.log("err: ");
				//console.log(err);
				//console.log("response.concepts: ");
				//console.log(response.concepts);
				//console.log("response.results: ");
				//console.log(response.results);
				Session.set('conceptList',response);
				}
			else
				Session.set('conceptList',null);
			});
		event.preventDefault();
   		}   		
    });

  Template.answer.events({
    'click': function (event) {
    	var docID=(event.target.pathname.substr(1));
		//console.log("clicked link for "+docID);

		Meteor.call("fetch_doc", docID, function(err, response) 
			{
   			if (response)
   				{
				//console.log("err: ");
				//console.log(err);
				//console.log(response.data.parts[0].data.substr());
				Session.set('corpusDoc',response);
				}
			});
		
		return false;
   		}   		
    });

Template.registerHelper('isNull',
    function(val) {
        return (val==null);
    });
    
Template.registerHelper('isNotNull',
    function(val) {
        return (val!=null);
    });
    
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
	//console.log("Started up!");
  });

}
