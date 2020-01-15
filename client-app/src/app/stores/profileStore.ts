import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed, reaction } from "mobx";
import { IProfile, IPhoto, IUserActivity } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable submitting = false;
  @observable updatingProfile = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;
  @observable userActivities: IUserActivity[] = [];
  @observable loadingActivities = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else return false;
  }

  @action loadUserActivities = async (username: string, predicate?: string) => {
    this.loadingActivities = true;
    const activities = await agent.Profiles.listActivities(username, predicate!);
    runInAction("loading activities", () => {
      this.userActivities = activities;
      this.loadingActivities = false;
    });
    try {
    } catch (error) {
      runInAction("loading activities error", () => {
        this.loadingActivities = false;
      });
      toast.error("Problems loading activities");
      console.log(error);
    }
  };

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction("loading profile", () => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction("loading profile error", () => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction("uploading photo", () => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo");
      runInAction("uploading photo error", () => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction("setting main photo", () => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(a => a.isMain)!.isMain = false;
        this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");
      runInAction("setting main photo error", () => {
        this.loading = false;
      });
      console.log(error);
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction("deleting photo", () => {
        this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
        this.loading = false;
      });
    } catch (error) {
      runInAction("deleting photo error", () => {
        this.loading = false;
      });
      toast.error("Problem deleting photo");
      console.log(error);
    }
  };

  @action editProfile = async (profile: IProfile) => {
    this.submitting = true;
    try {
      await agent.Profiles.update(profile);
      runInAction("editing profile", () => {
        this.rootStore.userStore.user!.displayName = profile.displayName;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("editing profile error", () => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    this.updatingProfile = true;
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction("updating profile", () => {
        if (profile.displayName !== this.rootStore.userStore.user!.displayName) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
        this.updatingProfile = false;
      });
    } catch (error) {
      toast.error("Problem updating profile");
      runInAction("updating profile error", () => {
        this.updatingProfile = false;
      });
      console.log(error);
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(username);
      runInAction("Following user", () => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.followings = [...this.followings, this.profile!];
        this.loading = false;
      });
    } catch (error) {
      runInAction("Following user error", () => {
        this.loading = false;
      });
      toast.error("Problems following user");
      console.log(error);
    }
  };

  @action unfollow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.unfollow(username);
      runInAction("Unfollowing user", () => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
        this.followings = this.followings.filter(x => x.username === username);
      });
    } catch (error) {
      runInAction("Unfollowing user error", () => {
        this.loading = false;
      });
      toast.error("Problems unfollowing user");
      console.log(error);
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
      runInAction("Loading followings", () => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      runInAction("Loading followings error", () => {
        this.loading = false;
      });
      toast.error("Problems loading followings");
      console.log(error);
    }
  };
}
