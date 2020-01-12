import React, { useContext, useState } from "react";
import { Tab, Grid, Header, Button } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileEditForm from "./ProfileEditForm";
import { IProfile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, profile, isCurrentUser, updatingProfile } = rootStore.profileStore;
  const [editMode, setEditProfileMode] = useState(false);

  const handleUpdateProfile = (profile: Partial<IProfile>) => {
    updateProfile(profile).then(() => setEditProfileMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={`About ${profile!.displayName}`} />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditProfileMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm updateProfile={handleUpdateProfile} profile={profile!} updatingProfile={updatingProfile} />
          ) : (
            <span>{profile!.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
