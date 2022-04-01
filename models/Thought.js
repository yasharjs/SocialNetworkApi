const { Schema, model, Types } = require("mongoose");

const reactionSchema = new Schema(
    {
       reactionId: {
          type: Schema.Types.ObjectId,
          default: () => new Types.ObjectId(),
       },
       reactionBody: {
          type: String,
          required: true,
          trim: true,
          maxLength: 280,
       },
       username: {
          type: String,
          required: true,
          trim: true,
       },
       createdAt: {
          type: Date,
          default: Date.now,
          get: timestamp => dateFormat(timestamp)
       },
    },
    {
       toJSON: {
          getters: true,
       },
       id: false,
    }
 );


const thoughtSchema = new Schema(
   {
      thoughtText: {
         type: String,
         required: true,
         trim: true,
         minLength: 1,
         maxLength: 280,
      },
      createdAt: {
         type: Date,
         default: Date.now,
         get: timestamp => dateFormat(timestamp)
      },
      username: {
         type: String,
         required: true,
         trim: true,
      },
      reactions: [reactionSchema],
   },
   {
      toJSON: {
         virtuals: true,
         getters: true,
      },
      id: false,
   }
);

// get total count of friends on retrieval
thoughtSchema.virtual("reactionCount").get(function () {
   return this.reactions.length;
});

// create the Thought model using the thoughtSchema
const Thought = model("Thought", thoughtSchema);

// export the Thought model
module.exports = Thought;
