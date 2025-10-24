import ErrorResponse from '../utils/ErrorResponseUtils.js';

const findWithPagination = async (model, filters = {}, options = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = '-createdAt',
        select = '',
        populate = ''
    } = options;

    const skip = (page - 1) * limit;

    const query = model.find(filters);

    if (select) query.select(select);
    if (populate) query.populate(populate);
    if (sort) query.sort(sort);

    const [data, total] = await Promise.all([
        query.skip(skip).limit(limit).exec(),
        model.countDocuments(filters)
    ]);

    return {
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

const createDocument = async (model, data) => {
    try {
        const document = await model.create(data);
        return document;
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            throw new ErrorResponse(`${field} already exists`, 400);
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            throw new ErrorResponse(messages.join(', '), 400);
        }
        throw error;
    }
};

const updateById = async (model, id, updates) => {
    const document = await model.findById(id);

    if (!document) {
        throw new ErrorResponse(`${model.modelName} not found`, 404);
    }

    Object.assign(document, updates);
    await document.save();

    return document;
};

const deleteById = async (model, id, softDelete = true) => {
    const document = await model.findById(id);

    if (!document) {
        throw new ErrorResponse(`${model.modelName} not found`, 404);
    }

    if (softDelete && document.delete) {
        await document.delete();
    } else {
        await model.findByIdAndDelete(id);
    }

    return document;
};

const findByIdWithPopulate = async (model, id, populate = '') => {
    const query = model.findById(id);

    if (populate) {
        query.populate(populate);
    }

    const document = await query.exec();

    if (!document) {
        throw new ErrorResponse(`${model.modelName} not found`, 404);
    }

    return document;
};

export default {
    findWithPagination,
    createDocument,
    updateById,
    deleteById,
    findByIdWithPopulate
};
