const softDeletePlugin = (schema) => {
    if (!schema.path('isActive')) {
        schema.add({
            isActive: {
                type: Boolean,
                default: true,
                index: true,
            },
        });
    }

    schema.add({
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        deletedBy: {
            type: String,
            default: null,
        },
    });

    schema.methods.softDelete = function (deletedBy = "system") {
        this.isDeleted = true;
        this.isActive = false;
        this.deletedAt = new Date();
        this.deletedBy = deletedBy;
        return this.save();
    };

    schema.methods.restore = function () {
        this.isDeleted = false;
        this.isActive = true;
        this.deletedAt = null;
        this.deletedBy = null;
        return this.save();
    };

    schema.statics.findNotDeleted = function (conditions = {}) {
        return this.find({ ...conditions, isDeleted: false });
    };

    schema.statics.findDeleted = function (conditions = {}) {
        return this.find({ ...conditions, isDeleted: true });
    };

    schema.statics.findOneNotDeleted = function (conditions = {}) {
        return this.findOne({ ...conditions, isDeleted: false });
    };
};

export default softDeletePlugin;
