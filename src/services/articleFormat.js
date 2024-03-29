import { findChildrenByType } from 'prosemirror-utils';

import EditorSchema from '~/components/RichTextEditor/utils/EditorSchema';
import convertFromJSON from '~/components/RichTextEditor/utils/convertFromJSON';

export function serializeArticleData(data = {}) {
  const { authors = [], has_financing, has_printed, financing_sources, content_blocks, sources,
          file_atachments, use_address_from_profile, printed, rubric_set, ...rest } = data;

  const serializedData = {
    ...rest,
    text_to_title: data.title,
    article_type: 1
  };

  rubric_set.forEach(item => {
    if (item) {
      serializedData.rubric = item;
    }
  });

  if (has_financing && financing_sources) {
    serializedData.financing_sources = financing_sources.filter(item => {
      return item.organization && item.grant_name && item.organization_id && item.grant_number;
    });
  }

  if (has_printed) {
    if (use_address_from_profile) {
      serializedData.printed = [{ use_address_from_profile: true }];
    } else {
      serializedData.printed = printed;
    }
  }

  const author = authors.find(author => author.id !== undefined);

  if (author) {
    serializedData.author = { user: author.id };

    if (author.roles) {
      serializedData.author.roles = Object.keys(author.roles)
        .filter(key => author.roles[key])
        .map(role => role.split('-')[1]);
    }
  }

  const collaborators = authors
    .filter(author => author.id !== undefined && author.id !== serializedData.author.user)
    .map(author => {
      const collaborator = { user: author.id };
      if(author.roles) {
        collaborator.roles = Object.keys(author.roles)
          .filter(key => author.roles[key])
          .map(role => role.split('-')[1]);
      }

      return collaborator;
    });

  if (collaborators.length) {
    serializedData.collaborators = collaborators;
  }

  if (content_blocks) {
    serializedData.content_blocks = [];
    serializedData.images = [];

    content_blocks.forEach((item, index) => {
      serializedData.content_blocks.push({
        title: item.title,
        ordered: index,
        content: item.content
      });

      // Привязка изображений к статье
      if (item.content) {
        const node = convertFromJSON(item.content);
        const imageBlocks = findChildrenByType(node.doc, EditorSchema.nodes['image-list']);
        imageBlocks.forEach(item => {
          const { images } = item.node.attrs;
          images.forEach(image => {
            serializedData.images.push(image.id);
          });
        });
      }
    });
  }

  if (file_atachments) {
    serializedData.file_atachments = file_atachments.map(item => {
      if (item.id !== undefined) {
        delete item.file;
      }
      return item
    });
  }

  if (sources) {
    serializedData.sources = sources.filter(item => item.resourcetype).map(item => {
      return item.author ? item : { ...item, author: item.authors }
    });
  }

  // Удаляем загруженные файлы, так как апи принимает только base64
  const fileKeys = ['incoming_file', 'list_literature_file'];

  fileKeys.forEach(key => {
    if (serializedData[key]) {
      const clearBase64 = serializedData[key].split(',')[1];
      if (!clearBase64 || (clearBase64 && !isBase64(clearBase64))) {
        delete serializedData[key];
      }
    }
  });

  return serializedData;
}

export function deserializeArticleData(data = {}) {
  const { author, collaborators, sources, images, ...rest } = data;
  const deserializedData = rest;

  if (author && collaborators) {
    deserializedData.authors = [
      {
        id: author.user.id,
        roles: author.roles && author.roles.reduce((result, role) =>
          ({ ...result, [`role-${role.id}`]: true }), {})
      },
      ...collaborators.map(item => ({
        id: item.user.id,
        roles: item.roles && item.roles.reduce((result, role) =>
          ({ ...result, [`role-${role.id}`]: true }), {})
      }))
    ];
  }

  if (sources) {
    deserializedData.sources = sources.map(item => {
      const newItem = { ...item };
      if (Array.isArray(item.author)) {
        newItem.authors = item.author;
        delete newItem.author;
      }

      return newItem;
    });
  }

  deserializedData.has_printed = Boolean(data.printed);
  deserializedData.use_address_from_profile = data.printed && data.printed[0] && data.printed[0].use_address_from_profile;
  return deserializedData;
}

function isBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}
