exports = {

  onArticleCreateCallback: async function (payload) {
    const strPayload = JSON.stringify(payload);
    console.info("Logging arguments from onArticleCreate event: " + strPayload);

    const articleId = payload.data.article.id;
    //console.info("Article_Id :", articleId);

    const articleDescription = payload.data.article.description_text;
    //console.info("Description Text: ", articleDescription);

    const articleTitle = payload.data.article.title;
    //console.info("Title: ", articleTitle);

    const articleType = payload.data.article.type;
    //console.info("Type: ", articleType);

    const articleStatus = payload.data.article.status;
   // console.info("Status: ", articleStatus);

    const articleFolderIdFreshservice = payload.iparams.folderId;
   // console.info("Folder Id: ", articleFolderIdFreshservice);

    const data = {
      "title": `${articleTitle}`,
      "description": `${articleDescription}`,
      "status": articleStatus,
      "article_type": articleType,
      "folder_id": articleFolderIdFreshservice,

    };
    console.info("Data: ", data);

    try {
      const articleCreateResponce = await $request.invokeTemplate(
        "createArticleFreshService", { body: JSON.stringify(data) }
      );
      //console.info("Responce of the created article: ", JSON.stringify(articleCreateResponce));

      const response = articleCreateResponce.response;
      
      const parseResponse = JSON.parse(response);
     
      const gotArticleId = parseResponse.article.id;
     

      const savedArticleId = await $db.set(`${articleId}`, { "articleId": `${gotArticleId}` }); 

      console.info("Article Createds Sucessfully. ", savedArticleId);
      

    } catch (err){
      console.error("Error in creating article: ",err);
    }

  },
  onArticleUpdateCallback: async function (payload) {
  //  console.info("Logging arguments from onArticleUpdate event: " + JSON.stringify(payload));

    const updatedArticleId = payload.data.article.id;
  //  console.info("Updated Article id: ", updatedArticleId);

    const updatedArticleTitle = payload.data.article.title;
  //  console.info("Update article title: ", updatedArticleTitle);

    const updatedArticleDescription = payload.data.article.description_text;
  //  console.info("Updated article Description: ", updatedArticleDescription);

    let data;
    let idForUrl;
    try {
      const savedarticleId = await $db.get(`${updatedArticleId}`);
    
      idForUrl = savedarticleId.articleId;
     
      data = {
        "title": `${updatedArticleTitle}`,
        "description": `${updatedArticleDescription}`
      };
      console.info("Updated Data: ", data);
    } catch (err) {
      console.error("Error in retriving from db: ", err);
    }

    try {
      const resultOfUpdate = await $request.invokeTemplate(
        "updateArticleFreshService",
        {
          context: { idForUrl },
          body: JSON.stringify(data)
        }
      );
      console.info("Article updated Sucessfully: ", resultOfUpdate);

    } catch (err) {
      console.error("Error in updating article :", err);
    }

  },
  onArticleDeleteCallback: async function (payload) {
 //   console.info("Logging arguments from onArticleDelete event: " + JSON.stringify(payload));

    const updatedArticleId = payload.data.article.id;
    
    let idForUrl;
    
    try {
      const savedarticleId = await $db.get(`${updatedArticleId}`);
      

      idForUrl = savedarticleId.articleId;
    //  console.info("only article ID: ", idForUrl);

      const resultOfDelete = await $request.invokeTemplate(
        "deleteArticleFreshService", { context: { idForUrl } }
      );
      console.info("Article deleted Sucessfully: ", resultOfDelete);

    } catch (err) {
      console.error("Error in deleting Article: ", err);
    }

  }
}