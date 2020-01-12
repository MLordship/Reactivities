import React from "react";
import { Form, Button } from "semantic-ui-react";
import { Form as FinalForm } from "react-final-form";
import { Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import { IProfile } from "../../app/models/profile";
import { combineValidators, isRequired } from "revalidate";
import { observer } from "mobx-react-lite";

interface IProps {
  profile: IProfile;
  updateProfile: (profile: Partial<IProfile>) => void;
  updatingProfile: boolean;
}

const validate = combineValidators({
  displayName: isRequired("display name"),
  bio: isRequired("bio")
});

const ProfileEditForm: React.FC<IProps> = ({ updateProfile, profile, updatingProfile }) => {
  return (
    <FinalForm
      onSubmit={updateProfile}
      validate={validate}
      initialValues={profile!}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} error>
          <Field name="displayName" component={TextInput} placeholder="Display Name" value={profile!.displayName} />
          <Field name="bio" component={TextAreaInput} rows={3} placeholder="Bio" value={profile!.bio} />
          <Button
            loading={updatingProfile}
            floated="right"
            disabled={invalid || pristine}
            positive
            content="Update profile"
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);
