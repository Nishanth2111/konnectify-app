exports = {

  onArticleCreateCallback: async function (payload) {
    const strPayload = JSON.stringify(payload);
    console.log("Logging arguments from onArticleCreate event: " + strPayload);

    const articleId = payload.data.article.id;
    console.log("Article_Id :", articleId);

    const articleDescription = payload.data.article.description_text;
    console.log("Description Text: ", articleDescription);

    const articleFolderIdFreshdesk = payload.data.article.folder_id;
    console.log("Folder_id: ", articleFolderIdFreshdesk);

    const articleTitle = payload.data.article.title;
    console.log("Title: ", articleTitle);

    const articleType = payload.data.article.type;
    console.log("Type: ", articleType);

    const articleStatus = payload.data.article.status;
    console.log("Status: ", articleStatus);

    const articleFolderIdFreshservice = payload.iparams.folderId;
    console.log("Folder Id: ", articleFolderIdFreshservice);

    const data = {
      "title": `${articleTitle}`,
      "description": `${articleDescription}`,
      "status": articleStatus,
      "article_type": articleType,
      "folder_id": articleFolderIdFreshservice,

    };

    console.log("Data: ", data);


    try {
      const articleCreateResponce = await $request.invokeTemplate(
        "createArticleFreshService", { body: JSON.stringify(data) }
      );
      console.log("Responce of the created article: ", JSON.stringify(articleCreateResponce));

      const response = articleCreateResponce.response;
      console.log("RESPONSE: ", response);
      
      const parseResponse = JSON.parse(response);
      console.log("Parse: ",parseResponse);

      const gotArticleId = parseResponse.article.id;
      console.log("GOT: ",gotArticleId);

      

      const savedArticleId = $db.set(`${articleId}`, { "articleId": gotArticleId });
      console.log("Saved Fresh service Article ID: ", savedArticleId);

    } catch (err) {
      console.log("Error in creating article: ", err);
    }

  },
  onArticleUpdateCallback: function (payload) {
    console.log("Logging arguments from onArticleUpdate event: " + JSON.stringify(payload));


  },
  onArticleDeleteCallback: function (payload) {
    console.log("Logging arguments from onArticleDelete event: " + JSON.stringify(payload));

  }
}