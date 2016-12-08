angular.module('starter.controllers', [])


.controller('inboxCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $cordovaSQLite, $rootScope, $state) {

 //-------------- displaying compose mail modal-----------------------
  
   $scope.mailData = {date:"", to:"", from:"mallikarjunangadi24@gmail.com", mailFrom:"", Cc:"", Bcc:"", subject:"", body:" ", files:[], attachment:""};
  $ionicModal.fromTemplateUrl('templates/compose.html', {
    scope: $scope 
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeCompose = function() {
    $scope.mailData = {date:"", to:"", from:"mallikarjunangadi24@gmail.com", mailFrom:"", Cc:"", Bcc:"", subject:"", body:" ", files:[], attachment:""};  
    $scope.modal.hide(); 
  }; 

  $scope.compose = function() {
//    $scope.mailData = {date:"", to:"", from:"mallikarjunangadi24@gmail.com", mailFrom:"", Cc:"", Bcc:"", subject:"", body:" ", files:[], attachment:""};
    console.log("Compose clicked");
    query = "SELECT description FROM files where filename= 'signature' ";
    $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
      if(res.rows.item(0)!= undefined)
      {
       // console.log(res.rows[0].description);
       $scope.mailData.body = "\n\n\n\n\n"+res.rows.item(0).description+"\n\n\t"+$scope.mailData.body;         
      }    
    });
       console.log($scope.mailData.subject);
       $scope.modal.show();    
  };

  //$scope.replyMailData = {date:"", to:"", from:"mallikarjunangadi24@gmail.com", Cc:"", Bcc:"", subject:"", body:" ", attachment:""};
//  $scope.replyMailData = {};

/*
  $ionicModal.fromTemplateUrl('templates/replyModal.html', {
    scope: $scope
  }).then( function(replyModal) {
    $scope.replyModal = replyModal;
  });

  $scope.replyModalShow = function() {
    $scope.replyModal.show();
  }  

  $scope.replyModalHide = function() {
    $scope.replyModal.hide();
  }
*/

  $rootScope.replyMail = function(mailBodyObj) {
    $scope.mailData.to = mailBodyObj.mailTo;
    $scope.mailData.Cc = mailBodyObj.mailCc;
    $scope.mailData.Bcc = mailBodyObj.mailBcc;
    $scope.mailData.mailFrom = mailBodyObj.mailFrom;
    $scope.mailData.subject ="Re : "+ mailBodyObj.mailSubject; 
    $scope.mailData.body = "\nOn "+mailBodyObj.mailDateTime+", "+mailBodyObj.mailFrom+" wrote: \n\t"+mailBodyObj.mailBody;
    $scope.mailData.date = mailBodyObj.mailDateTime;
    console.log($scope.mailData.body);
    
    $scope.compose();
  } 
   
//  $scope.checked = true;  


  $ionicModal.fromTemplateUrl('templates/mailBody.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;   
  });

  $scope.closeOpenMailModal = function() {
    $scope.modal2.hide();
  }; 

  $scope.mailBodyObj = {};
  $scope.openMailModal = function(mailObj) {
    $scope.mailBodyObj = mailObj;
    $scope.modal2.show();
  }

    $scope.showText = "Show Details"
    $scope.showMe = false;
    $scope.func = function() {
      if($scope.showMe){
        $scope.showText = "Show Details";
      } else {
        $scope.showText = "Hide Details"
      } 
      $scope.showMe = !$scope.showMe;
    } 

  //----------------- discard mail-------------------  

    $scope.discard = function() {
      $scope.saveToDraft();
      $scope.closeCompose();
   }
  //--------------------- save to draft ---------------------      

  $scope.saveToDraft = function() {
         console.log($scope.mailData.files.length+"............");
        $scope.closePopover2();
        var d = new Date();
     //   var temp = d.toString().replace('(India Standard Time)',"");
        var query = "INSERT INTO drafts (mailDateTime, mailTo, mailFrom, mailCc, mailBcc, mailSubject, mailBody, attachments) VALUES (?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute($rootScope.db, query, [d, $scope.mailData.to, $scope.mailData.from, $scope.mailData.Cc, $scope.mailData.Bcc, $scope.mailData.subject, $scope.mailData.body, $scope.mailData.attachment]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            console.log("saved to draft successfully...");
            
        }, function (err) {
            console.error(err); 
        });   

    } 
     
  //----------------- inbox mails database code ----------------------------
  
   $scope.inboxMails = [];
  
   $scope.loadInboxFromDB = function () { 
    $scope.inboxMails = [];
     query = "SELECT * FROM inbox";
     $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
       for(var i = 0; i<res.rows.length ; i++) {
       $scope.inboxMails[i] = {mailId: res.rows.item(i).id, mailDateTime: res.rows.item(i).mailDateTime, mailTo: res.rows.item(i).mailTo, mailFrom: res.rows.item(i).mailFrom, mailCc: res.rows.item(i).mailCc, mailBcc: res.rows.item(i).mailBcc, mailSubject: res.rows.item(i).mailSubject, mailBody: res.rows.item(i).mailBody, attachments: res.rows.item(i).attachments};
     }  
   })                
  }
 
 //------------------- delete inbox Mails ---------------------

 $scope.deleteMail = function(id) {
   var query = "delete from inbox where id="+id;
   console.log(query);
   $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
     console.log('mail deleted successfully');
     $scope.loadInboxFromDB();
     $scope.closeOpenMailModal();
   })
 } 
   
   //-------------file attachment popover code--------------------------- 

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
 
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  $scope.removePopover = function() {
    $scope.popover.remove();
  };

//------------------------ popover2 code ---------------------------------------------

  $ionicPopover.fromTemplateUrl('templates/popover2.html', {
    scope: $scope
  }).then(function(popover2) {
    $scope.popover2 = popover2;
  });

  $scope.openPopover2 = function($event) {
    $scope.popover2.show($event);
  };
  $scope.closePopover2 = function() {
    $scope.popover2.hide();
  };

  $scope.removePopover2 = function() {
    $scope.popover2.remove();
  };

 //-------------mailBodyPopover1 code--------------------------- 

  $ionicPopover.fromTemplateUrl('templates/mailBodyPopover1.html', {
    scope: $rootScope
  }).then(function(popover) {
    $rootScope.mailBodyPopover1 = popover;
  });
 
  $rootScope.openmailBodyPopover1 = function($event) {
    $rootScope.mailBodyPopover1.show($event);
  };
  $rootScope.closemailBodyPopover1 = function() {
    $rootScope.mailBodyPopover1.hide();
  };

  $rootScope.removemailBodyPopover1 = function() {
    $rootScope.mailBodyPopover1.remove();
  };

 //-------------mailBodyPopover2 code--------------------------- 

  $ionicPopover.fromTemplateUrl('templates/mailBodyPopover2.html', {
    scope: $rootScope
  }).then(function(popover) {
    $rootScope.mailBodyPopover2 = popover;
  });
 
  $rootScope.openmailBodyPopover2 = function($event) {
    $rootScope.mailBodyPopover2.show($event);
  };
  $rootScope.closemailBodyPopover2 = function() {
    $rootScope.mailBodyPopover2.hide();
  };

  $rootScope.mailBodyPopover2 = function() {
    $rootScope.mailBodyPopover2.remove();
  }; 


  //--------------------- on hold modal3 ---------------

  $ionicPopover.fromTemplateUrl('templates/onholdModal.html', {
    scope: $scope
  }).then( function(popover3) {
    $scope.popover3 = popover3; 
  });

  $scope.showOnHold = function($event) {
    console.log('entered......')
    $scope.popover3.show($event);
  }
    
//--------------- displaying selected attachment files -----------------------  

  $scope.filesDisplay = function(element) { 
    var files = element.files;
    var fileNames = [];

    $scope.popover.hide(); 

    for(var i = 0; i < files.length; i++) {
      var formatImage = getFormatImage(files[0].type);
      console.log(formatImage);
      fileNames.push({fileNames:files[i].name, imageIcon:formatImage});
    }
 
      function getFormatImage(input) {
      var str = "";
      if(input.search('audio')!=-1) {
        str = "img/audio.png";
      }
      else if(input.search('image')!=-1) {
        str = "img/image.png"; 
      }
      else if(input.search('pdf')!=-1) {
        str = "img/pdf.png";
      }
      else if(input.search('text')!=-1) {
        str = "img/txt.png";
      }
      else if(input.search('vidio')!=-1) {
        str = "img/vidio.jpg";
      }
      else if(input.search('word')!=-1) {
        str = "img/doc.png";
      }
      else {
        str = "img/file.png";
      }

      return str;
    }

    $scope.fileNames = fileNames;
    $scope.mailData.files = fileNames;

    $scope.removeAttachment = function (x) {
        $scope.fileNames.splice(x, 1);
        $scope.mailData.files = $scope.fileNames;
    }    
  };

  $scope.dummy = function() {
    $scope.popover.hide();
    console.log('Insert files from drive..');
  };   
   
 }) 

.controller('sentCtrl', function($scope, $ionicModal, $cordovaSQLite, $rootScope) {

  //-------------------- sent mails database code------------------------

    $ionicModal.fromTemplateUrl('templates/mailBody.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;   
  });

  $scope.closeOpenMailModal = function() {
    $scope.modal2.hide();
  }; 

  $scope.mailBodyObj = {};
  $scope.openMailModal = function(mailObj) {
    console.log("mailObj.. "+mailObj.mailFrom);
    $scope.mailBodyObj = mailObj;
     

    $scope.modal2.show();
  }

    $scope.showText = "Show Details"
    $scope.showMe = false;
    $scope.func = function() {
      if($scope.showMe){
        $scope.showText = "Show Details";
      } else {
        $scope.showText = "Hide Details"
      } 
      $scope.showMe = !$scope.showMe;
    } 
  

    $scope.sentMails = [];

   $scope.loadsentFromDB = function () { 
     $scope.sentMails = [];   
     query = "SELECT * FROM sentMails";
     $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
       for(var i = 0; i<res.rows.length ; i++) {
       $scope.sentMails[i] = {mailId: res.rows.item(i).id, mailDateTime: res.rows.item(i).mailDateTime, mailTo: res.rows.item(i).mailTo, mailFrom: res.rows.item(i).mailFrom, mailCc: res.rows.item(i).mailCc, mailBcc: res.rows.item(i).mailBcc, mailSubject: res.rows.item(i).mailSubject, mailBody: res.rows.item(i).mailBody, attachments: res.rows.item(i).attachments};
     }  
   })                
  }

   //------------------- delete sent Mails ---------------------

 $scope.deleteMail = function(id) {
   var query = "delete from sentMails where id="+id;
   console.log(query);
   $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
     console.log('mail deleted successfully');
     $scope.loadsentFromDB();
     $scope.closeOpenMailModal();
   })
 } 
 
})

.controller('draftCtrl', function($scope, $ionicModal, $cordovaSQLite, $rootScope) {

  //-------------------- draft mails database code------------------------

   $ionicModal.fromTemplateUrl('templates/mailBody.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;   
  });

  $scope.closeOpenMailModal = function() {
    $scope.modal2.hide();
  }; 

  $scope.mailBodyObj = {};
  $scope.openMailModal = function(mailObj) {
    console.log("mailObj.. "+mailObj.mailFrom);
    $scope.mailBodyObj = mailObj;
     

    $scope.modal2.show();
  }

    $scope.showText = "Show Details"
    $scope.showMe = false;
    $scope.func = function() {
      if($scope.showMe){
        $scope.showText = "Show Details";
      } else {
        $scope.showText = "Hide Details"
      } 
      $scope.showMe = !$scope.showMe;
    } 
  

    $scope.draftMails = [];
  
   $scope.loadDraftFromDB = function () { 
     $scope.draftMails = [];
     query = "SELECT * FROM drafts";
     $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
       for(var i = 0; i<res.rows.length ; i++) {
       $scope.draftMails[i] = {mailId: res.rows.item(i).id, mailDateTime: res.rows.item(i).mailDateTime, mailTo: res.rows.item(i).mailTo, mailFrom: res.rows.item(i).mailFrom, mailCc: res.rows.item(i).mailCc, mailBcc: res.rows.item(i).mailBcc, mailSubject: res.rows.item(i).mailSubject, mailBody: res.rows.item(i).mailBody, attachments: res.rows.item(i).attachments};
     }  
   })               
  } 

     //------------------- delete drafts Mails ---------------------

 $scope.deleteMail = function(id) {
   var query = "delete from drafts where id="+id;
   console.log(query);
   $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
     console.log('mail deleted successfully');
     $scope.loadDraftFromDB();
     $scope.closeOpenMailModal();
   })
 } 

})

.controller('spamCtrl', function($scope, $ionicModal, $cordovaSQLite,$rootScope) {

  //-------------------- spam mails database code------------------------

     $ionicModal.fromTemplateUrl('templates/mailBody.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;   
  });

  $scope.closeOpenMailModal = function() {
    $scope.modal2.hide();
  }; 

  $scope.mailBodyObj = {};
  $scope.openMailModal = function(mailObj) {
    console.log("mailObj.. "+mailObj.mailFrom);
    $scope.mailBodyObj = mailObj;
     

    $scope.modal2.show();
  }

    $scope.showText = "Show Details"
    $scope.showMe = false;
    $scope.func = function() {
      if($scope.showMe){
        $scope.showText = "Show Details";
      } else {
        $scope.showText = "Hide Details"
      } 
      $scope.showMe = !$scope.showMe;
    } 


    $scope.spamMails = [];

   $scope.loadSpamFromDB = function () { 
    $scope.spamMails = [];
     query = "SELECT * FROM spam";
     $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
       for(var i = 0; i<res.rows.length ; i++) {
       $scope.spamMails[i] = {mailId: res.rows.item(i).id, mailDateTime: res.rows.item(i).mailDateTime, mailTo: res.rows.item(i).mailTo, mailFrom: res.rows.item(i).mailFrom, mailCc: res.rows.item(i).mailCc, mailBcc: res.rows.item(i).mailBcc, mailSubject: res.rows.item(i).mailSubject, mailBody: res.rows.item(i).mailBody, attachments: res.rows.item(i).attachments};
     }  
   })               
  }

     //------------------- delete spam Mails ---------------------

 $scope.deleteMail = function(id) {
   var query = "delete from spam where id="+id;
   console.log(query);
   $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
     console.log('mail deleted successfully');
     $scope.loadSpamFromDB();
     $scope.closeOpenMailModal();
   })
 } 
 
})

.controller('binCtrl', function($scope, $ionicModal, $cordovaSQLite,$rootScope) {

  //-------------------- bin mails database code------------------------

   $ionicModal.fromTemplateUrl('templates/mailBody.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;   
  });

  $scope.closeOpenMailModal = function() {
    $scope.modal2.hide();
  }; 

  $scope.mailBodyObj = {};
  $scope.openMailModal = function(mailObj) {
    console.log("mailObj.. "+mailObj.mailFrom);
    $scope.mailBodyObj = mailObj;
     

    $scope.modal2.show();
  }

    $scope.showText = "Show Details"
    $scope.showMe = false;
    $scope.func = function() {
      if($scope.showMe){
        $scope.showText = "Show Details";
      } else {
        $scope.showText = "Hide Details"
      } 
      $scope.showMe = !$scope.showMe;
    } 

    $scope.binMails = [];

   $scope.loadBinFromDB = function () { 
     $scope.binMails = [];
     query = "SELECT * FROM bin";
     $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
       for(var i = 0; i<res.rows.length ; i++) {
       $scope.binMails[i] = {mailId: res.rows.item(i).id, mailDateTime: res.rows.item(i).mailDateTime, mailTo: res.rows.item(i).mailTo, mailFrom: res.rows.item(i).mailFrom, mailCc: res.rows.item(i).mailCc, mailBcc: res.rows.item(i).mailBcc, mailSubject: res.rows.item(i).mailSubject, mailBody: res.rows.item(i).mailBody, attachments: res.rows.item(i).attachments};
     }  
   })               
  } 

 //------------------- delete bin Mails ---------------------

 $scope.deleteMail = function(id) {
   var query = "delete from bin where id="+id;
   console.log(query);
   $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
     console.log('mail deleted successfully');
     $scope.loadBinFromDB();
     $scope.closeOpenMailModal();
   })
 } 

})


  .controller("helpCtrl", function($scope, $cordovaSQLite,$rootScope) {   
 
  $scope.deleteAll = function(tableName)
  {
    var query = "delete from "+tableName;
    $cordovaSQLite.execute($rootScope.db, query).then( function() {
      console.log(tableName+' records deleted successfully..')
    });
  }

    $scope.storeValues = function(value) {
      insertInbox(value, "sandeep<sandeep@gmail.com>;naresh<naresh@gmail.com>", "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "About My Project", "This is sample mail body ", "img/me.jpg");
      insertInbox(value, "akshay<sandeep@gmail.com>;naresh<naresh@gmail.com>",  "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "this is long subject messeg to text the lines print and also nothing to say",       "This is long body messege to print and check body lines and text wrap fghjk shuhjw dkjnsnksmkd ", "img/ronaldo.jpg");
      insertInbox(value, "anoop<sandeep@gmail.com>;naresh<naresh@gmail.com>",   "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "i dont know",      "n jkdnkck dmk ckdmkcmdld ", "img/messi.jpg");
      insertInbox(value, "vinayak<sandeep@gmail.com>;naresh<naresh@gmail.com>", "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "Html",             "knknsklmcm lmlkdmm mkdm  ", "img/happy.jpg");
      insertInbox(value, "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "Css Project",      "mlmcdll,cd,l,ld,l,dl ldd ", "img/tiger.jpg");
      insertInbox(value, "sunitha<sandeep@gmail.com>;naresh<naresh@gmail.com>", "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "Angular Project",  "mkmks mkdl,dlldl, ,lddl, ", "img/vidio.jpg");
      insertInbox(value, "sanjay<sandeep@gmail.com>;naresh<naresh@gmail.com>",  "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "Javascri Project", "This is sample mail body ", "img/ronaldo.jpg");
      insertInbox(value, "harish<sandeep@gmail.com>;naresh<naresh@gmail.com>",  "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "css Project",      "233 338u3u83 kmef ke,v l ", "img/messi.jpg");
      insertInbox(value, "swathi<swathi@gmail.com>;naresh<naresh@gmail.com>",   "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "nodejs MyProject", "^T*&Y((***U)(&^*&* ,ld)) ", "img/me.jpg");
      insertInbox(value, "ram<ram@gmail.com>;naresh<naresh@gmail.com>",         "abhiram<sandeep@gmail.com>;naresh<naresh@gmail.com>", "sindhu<sindhu@gmail.com>;swathi<swathi@gmail.com>", "yash<yash@gmail.com>;sheetal<sheetal@gmail.com>", "About My Project", "*&^xjiji8 u8d090dklm md9 ", "img/happy.jpg"); 
    } 
       
      function insertInbox(value, mailTo, mailFrom, mailCc, mailBcc, mailSubject, mailBody, attachments) {
        var d = new Date();
        var query = "INSERT INTO "+value+" (mailDateTime, mailTo, mailFrom, mailCc, mailBcc, mailSubject, mailBody, attachments) VALUES (?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute($rootScope.db, query, [d, mailTo, mailFrom, mailCc, mailBcc, mailSubject, mailBody, attachments]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            console.log(value+" records inserted successfully...");
        }, function (err) {
            console.error(err); 
        });  
    }   
       
    $scope.inboxMails = [];
    
    $scope.loadInboxFromDB = function () { 
      query = "SELECT * FROM inbox";
      $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
        for(var i = 0; i<res.rows.length ; i++) {
        $scope.inboxMails[i] = {mailId: res.rows.item(i).id, mailDateTime: res.rows.item(i).mailDateTime, mailTo: res.rows.item(i).mailTo, mailFrom: res.rows.item(i).mailFrom, mailCc: res.rows.item(i).mailCc, mailBcc: res.rows.item(i).mailBcc, mailSubject: res.rows.item(i).mailSubject, mailBody: res.rows.item(i).mailBody, attachments: res.rows.item(i).attachments};
      }   
    })                
  }   
    
})

.controller('signatureCtrl', function($scope, $cordovaSQLite,$rootScope, $state) {
  $scope.signature = {description:""};

  $scope.$on("$ionicView.beforeEnter", function(event, data) {

      var query = "SELECT description FROM files where fileName = 'signature'";
      $cordovaSQLite.execute($rootScope.db, query).then( function(res) {
        if(res.rows.item(0)!=undefined)
        {
         $scope.signature.description = res.rows.item(0).description;  
        }
      }
      ,function(err)
      {
        console.log(err);
      });
  });    

   
   $scope.cancel = function() {
     $state.go('app.settings');
   }

   $scope.save = function() {
    
     var desc = $scope.signature.description; 
     console.log($scope.signature);
        var query = "insert or replace into files (id, fileName, description) VALUES (?, ?, ?)";
        $cordovaSQLite.execute($rootScope.db, query, [1,"signature", desc]).then(function(res) {
            console.log("INSERT ID : " + res.insertId);
            console.log(" record inserted successfully...");
        }, function (err) {
            console.error(err); 
        });
   }
 
   $scope.clear = function() {
     $scope.signature = {description:""}; 
   }   
      
 /*           
    var query = "delete from files";
    $cordovaSQLite.execute(db, query).then( function() {
      console.log(' records deleted successfully..')
    });
 */   
    
}) 