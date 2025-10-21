import ErrorResponse from "./ErrorResponse.js";

export const softDeleteById = async (Model, id, deletedBy = "system") => {
  const document = await Model.findById(id);
  if (!document) throw new ErrorResponse(`${Model.modelName} not found`, 404);
  if (document.isDeleted) throw new ErrorResponse(`${Model.modelName} is already deleted`, 400);
  return await document.softDelete(deletedBy);
};

export const restoreById = async (Model, id) => {
  const document = await Model.findById(id);
  if (!document) throw new ErrorResponse(`${Model.modelName} not found`, 404);
  if (!document.isDeleted) throw new ErrorResponse(`${Model.modelName} is not deleted`, 400);
  return await document.restore();
};

export const getPaginatedList = async (Model, query = {}, filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let queryBuilder = Model.findNotDeleted(filter).skip(skip).limit(parseInt(limit)).sort(sort);

  if (options.populate) queryBuilder = queryBuilder.populate(options.populate);
  if (options.select) queryBuilder = queryBuilder.select(options.select);

  const [data, total] = await Promise.all([
    queryBuilder.exec(),
    Model.countDocuments({ ...filter, isDeleted: false }),
  ]);

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getDeletedDocuments = async (Model, filter = {}) => {
  return await Model.findDeleted(filter).sort("-deletedAt");
};

export const bulkSoftDelete = async (Model, ids, deletedBy = "system") => {
  const results = { success: [], failed: [], alreadyDeleted: [] };
  for (const id of ids) {
    try {
      const document = await Model.findById(id);
      if (!document) {
        results.failed.push({ id, reason: "Not found" });
        continue;
      }
      if (document.isDeleted) {
        results.alreadyDeleted.push(id);
        continue;
      }
      await document.softDelete(deletedBy);
      results.success.push(id);
    } catch (error) {
      results.failed.push({ id, reason: error.message });
    }
  }
  return results;
};

export const bulkRestore = async (Model, ids) => {
  const results = { success: [], failed: [], notDeleted: [] };
  for (const id of ids) {
    try {
      const document = await Model.findById(id);
      if (!document) {
        results.failed.push({ id, reason: "Not found" });
        continue;
      }
      if (!document.isDeleted) {
        results.notDeleted.push(id);
        continue;
      }
      await document.restore();
      results.success.push(id);
    } catch (error) {
      results.failed.push({ id, reason: error.message });
    }
  }
  return results;
};

export const searchDocuments = async (Model, searchTerm, searchFields = [], additionalFilter = {}) => {
  if (!searchTerm || searchFields.length === 0) return [];
  const searchConditions = searchFields.map((field) => ({
    [field]: { $regex: searchTerm, $options: "i" },
  }));
  return await Model.findNotDeleted({ ...additionalFilter, $or: searchConditions });
};

export const toggleActiveStatus = async (Model, id) => {
  const document = await Model.findById(id);
  if (!document) throw new ErrorResponse(`${Model.modelName} not found`, 404);
  if (document.isDeleted) throw new ErrorResponse(`Cannot change status of deleted ${Model.modelName}`, 400);
  document.isActive = !document.isActive;
  return await document.save();
};

export const getDocumentStats = async (Model) => {
  const [total, active, inactive, deleted] = await Promise.all([
    Model.countDocuments({}),
    Model.countDocuments({ isActive: true, isDeleted: false }),
    Model.countDocuments({ isActive: false, isDeleted: false }),
    Model.countDocuments({ isDeleted: true }),
  ]);
  return { total, active, inactive, deleted, notDeleted: active + inactive };
};

export default {
  softDeleteById,
  restoreById,
  getPaginatedList,
  getDeletedDocuments,
  bulkSoftDelete,
  bulkRestore,
  searchDocuments,
  toggleActiveStatus,
  getDocumentStats,
};
