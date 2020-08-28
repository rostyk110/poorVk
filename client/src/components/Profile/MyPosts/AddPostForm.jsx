import {reduxForm} from "redux-form";
import {createField, Textarea} from "../../UI/FormControls/FormControls";
import React from "react";
import {maxLength4096} from "../../../utils/validators";

let AddPostForm = ({handleSubmit}) => {
  return (
    <form onSubmit={handleSubmit}>
      {createField("post", "What's new?", Textarea, [maxLength4096], {cols: 50})}
      <div>
        <button>Publish</button>
      </div>
    </form>
  )
}

export default AddPostForm = reduxForm({
  form: 'posts'
})(AddPostForm)
