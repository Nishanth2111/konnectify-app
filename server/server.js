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
      console.log("Parse: ", parseResponse);

      const gotArticleId = parseResponse.article.id;
      console.log("GOT: ", gotArticleId);

      const savedArticleId = await $db.set(`${articleId}`, { "articleId": `${gotArticleId}` });
      console.log("Saved Fresh service Article ID: ", savedArticleId);

    } catch (err) {
      console.log("Error in creating article: ", err);
    }

  },
  onArticleUpdateCallback: async function (payload) {
    console.log("Logging arguments from onArticleUpdate event: " + JSON.stringify(payload));

    const updatedArticleId = payload.data.article.id;
    console.log("Updated Article id: ", updatedArticleId);

    const updatedArticleTitle = payload.data.article.title;
    console.log("Update article title: ", updatedArticleTitle);

    const updatedArticleDescription = payload.data.article.description_text;
    console.log("Updated article Description: ", updatedArticleDescription);

    let data;
    let idForUrl;
    try {
      const savedarticleId = await $db.get(`${updatedArticleId}`);
      console.log("Saved Article Id Db: ", savedarticleId);

      idForUrl = savedarticleId.articleId;
      console.log("only article ID: ", idForUrl);

      data = {
        "title": `${updatedArticleTitle}`,
        "description": `${updatedArticleDescription}`
      };
      console.log("Updated Data: ", data);
    } catch (err) {
      console.log("Error in retriving from db: ", err);
    }

    try {
      const resultOfUpdate = await $request.invokeTemplate(
        "updateArticleFreshService",
        {
          context: { idForUrl },
          body: JSON.stringify(data)
        }
      );
      console.log("Result of update: ", resultOfUpdate);

    } catch (err) {
      console.log("Error in update article :", err);
    }

  },
  onArticleDeleteCallback: async function (payload) {
    console.log("Logging arguments from onArticleDelete event: " + JSON.stringify(payload));

    const updatedArticleId = payload.data.article.id;
    console.log("Updated Article id: ", updatedArticleId); 

    let idForUrl;
    
    try {
      const savedarticleId = await $db.get(`${updatedArticleId}`);
      console.log("Saved Article Id Db: ", savedarticleId);

      idForUrl = savedarticleId.articleId;
      console.log("only article ID: ", idForUrl);

      const resultOfDelete = await $request.invokeTemplate(
        "deletingArticleFreshService", { context: { idForUrl } }
      );
      console.log("Result Sucess: ", resultOfDelete);

    } catch (err) {
      console.log("Error: ", err);
    }

  }
}