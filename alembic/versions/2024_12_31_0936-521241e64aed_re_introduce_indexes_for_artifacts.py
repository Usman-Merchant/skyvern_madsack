"""re-introduce indexes for artifacts

Revision ID: 521241e64aed
Revises: 172cdfb3e2ee
Create Date: 2024-12-31 09:36:18.974818+00:00

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "521241e64aed"
down_revision: Union[str, None] = "172cdfb3e2ee"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index("org_observer_cruise_index", table_name="artifacts")
    op.drop_index("org_observer_thought_index", table_name="artifacts")
    op.drop_index("org_wfrb_index", table_name="artifacts")
    op.drop_index("org_workflow_run_index", table_name="artifacts")
    op.create_index(op.f("ix_artifacts_observer_cruise_id"), "artifacts", ["observer_cruise_id"], unique=False)
    op.create_index(op.f("ix_artifacts_observer_thought_id"), "artifacts", ["observer_thought_id"], unique=False)
    op.create_index(op.f("ix_artifacts_workflow_run_block_id"), "artifacts", ["workflow_run_block_id"], unique=False)
    op.create_index(op.f("ix_artifacts_workflow_run_id"), "artifacts", ["workflow_run_id"], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_artifacts_workflow_run_id"), table_name="artifacts")
    op.drop_index(op.f("ix_artifacts_workflow_run_block_id"), table_name="artifacts")
    op.drop_index(op.f("ix_artifacts_observer_thought_id"), table_name="artifacts")
    op.drop_index(op.f("ix_artifacts_observer_cruise_id"), table_name="artifacts")
    op.create_index("org_workflow_run_index", "artifacts", ["organization_id", "workflow_run_id"], unique=False)
    op.create_index("org_wfrb_index", "artifacts", ["organization_id", "workflow_run_block_id"], unique=False)
    op.create_index("org_observer_thought_index", "artifacts", ["organization_id", "observer_thought_id"], unique=False)
    op.create_index("org_observer_cruise_index", "artifacts", ["organization_id", "observer_cruise_id"], unique=False)
    # ### end Alembic commands ###
