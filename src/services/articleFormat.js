export function serializeArticleData(data = {}) {
  const { authors = [], has_financing, financing_sources, blocks, ...rest } = data;

  const serializedData = {
    ...rest,
    text_to_title: data.title,
    article_type: 1
  };

  if (has_financing && financing_sources) {
    serializedData.financing_sources = financing_sources.filter(item => {
      return item.organization && item.grant_name && item.financing_id && item.grant_number;
    });

    if (!serializedData.financing_sources.length) {
      delete serializedData.financing_sources;
    }
  }

  const author = authors.find(author => author.id !== undefined);

  if (author) {
    serializedData.author = { user: author.id };

    if(author.roles) {
      serializedData.author.roles = author.roles;
    }
  }

  const collaborators = authors
    .filter(author => author.id !== undefined && author.id !== serializedData.author.user)
    .map(author => {
      const collaborator = { user: author.id };
      if(author.roles) {
        collaborator.roles = author.roles;
      }

      return collaborator;
    });

  if (collaborators.length) {
    serializedData.collaborators = collaborators;
  }

  if (blocks) {
    serializedData.blocks = blocks.map((item, index) => ({
      title: item.title,
      ordered: index,
      content: item.content
    }));
  }

  return serializedData;
}

export function deserializeArticleData(data = {}) {
  const { author, collaborators, ...rest } = data;
  const deserializedData = rest;
  if (author && collaborators) {
    deserializedData.authors = [{
      id: author.user,
      roles: author.roles,
    }, ...collaborators.map(item => ({ id: item.user, roles: item.roles }))];
  }
  return deserializedData;
}
